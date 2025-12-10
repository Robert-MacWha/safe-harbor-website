// Firestore REST API client for Cloudflare Workers compatibility
// The Firebase JS SDK is not compatible with Cloudflare Workers runtime

const PROJECT_ID = 'safe-harbor-d9e89';
const API_KEY = 'AIzaSyCv3QG-zp-LzECStF9GvhfOlzRi0smUxGI';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents`;

// Firestore REST API value types
interface FirestoreValue {
    stringValue?: string;
    integerValue?: string;
    doubleValue?: number;
    booleanValue?: boolean;
    timestampValue?: string;
    mapValue?: { fields: Record<string, FirestoreValue> };
    arrayValue?: { values?: FirestoreValue[] };
    referenceValue?: string;
    nullValue?: null;
}

interface FirestoreDocument {
    name: string;
    fields?: Record<string, FirestoreValue>;
    createTime: string;
    updateTime: string;
}

interface ListDocumentsResponse {
    documents?: FirestoreDocument[];
    nextPageToken?: string;
}

// Recursively parse Firestore typed values to plain JavaScript values
function parseFirestoreValue(value: FirestoreValue): unknown {
    if (value.stringValue !== undefined) return value.stringValue;
    if (value.integerValue !== undefined) return parseInt(value.integerValue, 10);
    if (value.doubleValue !== undefined) return value.doubleValue;
    if (value.booleanValue !== undefined) return value.booleanValue;
    if (value.nullValue !== undefined) return null;

    if (value.timestampValue !== undefined) {
        // Convert ISO timestamp to epoch milliseconds
        return new Date(value.timestampValue).getTime();
    }

    if (value.referenceValue !== undefined) {
        // Extract document path from full reference:
        // projects/{project}/databases/{db}/documents/{path} -> {path}
        const match = value.referenceValue.match(/\/documents\/(.+)$/);
        return match ? match[1] : value.referenceValue;
    }

    if (value.mapValue?.fields) {
        return parseFirestoreFields(value.mapValue.fields);
    }

    if (value.arrayValue) {
        return (value.arrayValue.values || []).map(parseFirestoreValue);
    }

    return null;
}

function parseFirestoreFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
    const result: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(fields)) {
        result[key] = parseFirestoreValue(value);
    }
    return result;
}

// List all documents in a collection
export async function listDocuments<T>(collectionPath: string): Promise<T[]> {
    const url = `${BASE_URL}/${collectionPath}?key=${API_KEY}`;
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Firestore list failed: ${response.status} ${response.statusText}`);
    }

    const data: ListDocumentsResponse = await response.json();

    if (!data.documents) {
        return [];
    }

    return data.documents.map(doc => {
        if (!doc.fields) return {} as T;
        return parseFirestoreFields(doc.fields) as T;
    });
}

// Get a single document by path
export async function getDocument<T>(documentPath: string): Promise<T | null> {
    const url = `${BASE_URL}/${documentPath}?key=${API_KEY}`;
    const response = await fetch(url);

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error(`Firestore get failed: ${response.status} ${response.statusText}`);
    }

    const doc: FirestoreDocument = await response.json();

    if (!doc.fields) {
        return null;
    }

    return parseFirestoreFields(doc.fields) as T;
}
