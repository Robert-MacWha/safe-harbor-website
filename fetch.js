import { ethers } from "ethers";

const KEY = "ZZCNTQH1TFTIJHI6ATY62JSZY1DZHGBB5T";
const ADDRESS = "0x94A84433101A10aEda762968f6995c574D1bF154".toLowerCase();
const API = "https://api.etherscan.io/v2/api";

async function get(params) {
    const qs = new URLSearchParams({ ...params, apikey: KEY }).toString();
    const url = `${API}?${qs}`;

    const res = await fetch(url);
    if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
    }
    return res.json();
}

async function fetchNative(address) {
    const data = await get({
        chainid: 1,
        module: "account",
        action: "txlist",
        address,
        startblock: 0,
        endblock: 15784088,
        sort: "asc",
    });

    if (!Array.isArray(data.result)) {
        console.error("Unexpected native result:", data);
        return [];
    }
    return data.result;
}

async function fetchErc20(address) {
    const data = await get({
        chainid: 1,
        module: "account",
        action: "tokentx",
        address,
        startblock: 0,
        endblock: 99999999,
        sort: "asc",
    });

    if (!Array.isArray(data.result)) {
        console.error("Unexpected erc20 result:", data);
        return [];
    }
    return data.result;
}

function toYAML(obj) {
    const indent = (level) => "  ".repeat(level);

    function render(value, level = 0) {
        if (Array.isArray(value)) {
            return value
                .map((v) => `${indent(level)}- ${renderItem(v, level + 1)}`)
                .join("\n");
        } else if (typeof value === "object" && value !== null) {
            return Object.entries(value)
                .map(
                    ([k, v]) =>
                        `${indent(level)}${k}: ${typeof v === "object" ? `\n${render(v, level + 1)}` : v
                        }`
                )
                .join("\n");
        }
        return String(value);
    }

    function renderItem(value, level) {
        if (typeof value === "object") return `\n${render(value, level)}`;
        return value;
    }

    return render(obj);
}

async function main() {
    if (!KEY) {
        console.error("Missing ETHERSCAN_API_KEY");
        process.exit(1);
    }

    const native = await fetchNative(ADDRESS);
    const erc20 = await fetchErc20(ADDRESS);

    console.log("Fetched native txns:", native.length);
    console.log("Fetched ERC20 txns:", erc20.length);

    // Filter incoming
    const incomingNative = native.filter(
        (tx) => tx.to?.toLowerCase() === ADDRESS
    );

    const incomingErc20 = erc20.filter(
        (tx) => tx.to?.toLowerCase() === ADDRESS
    );

    // Aggregate native ETH
    let nativeTotal = 0n;
    const nativeHashes = new Set();

    for (const tx of incomingNative) {
        nativeTotal += BigInt(tx.value);
        nativeHashes.add(tx.hash);
    }

    // Aggregate ERC20
    const erc20Totals = {};
    const senders = new Set();
    const erc20Hashes = new Set();

    for (const tx of incomingErc20) {
        const addr = tx.contractAddress.toLowerCase();
        const amount = BigInt(tx.value);
        const decimals = parseInt(tx.tokenDecimal);
        const symbol = tx.tokenSymbol;

        if (!erc20Totals[addr]) {
            erc20Totals[addr] = {
                symbol,
                decimals,
                total: 0n,
            };
        }

        erc20Totals[addr].total += amount;
        senders.add(tx.from.toLowerCase());
        erc20Hashes.add(tx.hash);
    }

    // Build report
    const report = {
        native: {
            wei: nativeTotal.toString(),
            eth: ethers.formatEther(nativeTotal),
        },
        erc20: Object.entries(erc20Totals).map(([addr, info]) => ({
            tokenAddress: addr,
            symbol: info.symbol,
            decimals: info.decimals,
            raw: info.total.toString(),
            formatted: ethers.formatUnits(info.total, info.decimals),
        })),
        erc20Senders: [...senders],
        txHashes: [...new Set([...nativeHashes, ...erc20Hashes])],
    };

    console.log("Report:", JSON.stringify(report, null, 2));


    // function toYamlLines(lines) {
    //     return lines.join("\n");
    // }

    // // Build YAML sections
    // const valueTokenLines = ["value_tokens:"];

    // for (const t of report.erc20) {
    //     const symbol = t.symbol || t.tokenAddress;
    //     const amount = t.formatted;
    //     const addr = t.tokenAddress;

    //     valueTokenLines.push(`  ${symbol}: ${amount} # ${addr}`);
    // }

    // const txLines = ["whitehat_transactions:"];

    // for (const link of report.txHashes) {
    //     txLines.push(`  - ${link}`);
    // }

    // // Final YAML
    // const yamlOutput = toYamlLines([...valueTokenLines, "", ...txLines]);

    // console.log(yamlOutput);
}

main().catch(console.error);
