import type { AgreementDetailsV2, Account, Chain, BountyTerms, Contact, ChildContractScope, IdentityRequirements } from './types/agreementDetailsV2';

/**
 * Validates AgreementDetailsV2 data and returns an array of error messages
 * @returns Array of validation error messages (empty if valid)
 */
export function validateAgreementDetailsV2(details: AgreementDetailsV2): string[] {
	const errors: string[] = [];

	if (!details.name.trim()) {
		errors.push('Protocol name is required');
	}

	if (
		details.contact.length === 0 ||
		!details.contact.some((c) => c.name.trim() && c.contact.trim())
	) {
		errors.push('At least one valid contact with both name and contact information is required');
	}

	if (details.chains.length === 0) {
		errors.push('At least one chain is required');
	}

	for (let i = 0; i < details.chains.length; i++) {
		const chain = details.chains[i];
		if (!chain.assetRecoveryAddress.trim()) {
			errors.push(`Asset recovery address is required for chain ${i + 1}`);
		}
		if (!chain.id.trim()) {
			errors.push(`Chain ID is required for chain ${i + 1}`);
		}
		if (chain.accounts.length === 0 || !chain.accounts.some((a) => a.address.trim())) {
			errors.push(`At least one valid account address is required for chain ${i + 1}`);
		}
	}

	// Bounty terms validation
	const { bountyCapUSD, aggregateBountyCapUSD, retainable, bountyPercentage } = details.bountyTerms;

	if (bountyPercentage < 0.1 || bountyPercentage > 100) {
		errors.push('Bounty percentage must be between 0.1% and 100%');
	}

	if (bountyCapUSD < 1) {
		errors.push('Bounty cap must be at least $1');
	}

	if (retainable && aggregateBountyCapUSD > 0) {
		errors.push('Aggregate cap must be zero when retainable is set to yes');
	}

	if (!retainable && aggregateBountyCapUSD > 0 && aggregateBountyCapUSD <= bountyCapUSD) {
		errors.push('Aggregate cap must be higher than cap');
	}

	// Address format validation (basic check)
	for (let i = 0; i < details.chains.length; i++) {
		const chain = details.chains[i];
		if (chain.assetRecoveryAddress && !chain.assetRecoveryAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
			errors.push(`Invalid asset recovery address format for chain ${i + 1} (must be 42-character hex string starting with 0x)`);
		}

		for (let j = 0; j < chain.accounts.length; j++) {
			const account = chain.accounts[j];
			if (account.address && !account.address.match(/^0x[a-fA-F0-9]{40}$/)) {
				errors.push(`Invalid account address format for chain ${i + 1}, account ${j + 1} (must be 42-character hex string starting with 0x)`);
			}
		}
	}

	return errors;
}

function childContractScopeToNumber(scope: ChildContractScope): number {
	switch (scope) {
		case 'None':
			return 0;
		case 'ExistingOnly':
			return 1;
		case 'All':
			return 2;
		case 'FutureOnly':
			return 3;
		default:
			throw new Error(`Unknown child contract scope: ${scope}`);
	}
}

function identityToNumber(identity: IdentityRequirements): number {
	switch (identity) {
		case 'Anonymous':
			return 0;
		case 'Pseudonymous':
			return 1;
		case 'Named':
			return 2;
		default:
			throw new Error(`Unknown identity type: ${identity}`);
	}
}

export function generateAgreementJSON(details: AgreementDetailsV2): string {
	const json = {
		agreementURI: details.agreementURI,
		bountyTerms: {
			aggregateBountyCapUSD: details.bountyTerms.aggregateBountyCapUSD,
			bountyCapUSD: details.bountyTerms.bountyCapUSD,
			bountyPercentage: details.bountyTerms.bountyPercentage,
			diligenceRequirements: details.bountyTerms.diligenceRequirements,
			identity: identityToNumber(details.bountyTerms.identity),
			retainable: details.bountyTerms.retainable
		},
		chains: details.chains.map((chain) => ({
			accounts: chain.accounts.map((account) => ({
				accountAddress: account.address,
				childContractScope: childContractScopeToNumber(account.childContractScope),
			})),
			assetRecoveryAddress: chain.assetRecoveryAddress,
			id: chain.id,
		})),
		contact: details.contact.map((contact) => ({
			contact: contact.contact,
			name: contact.name,
		})),
		protocolName: details.name,
	}
	return JSON.stringify(json, null, 4);
}

export function generateAgreementTuple(details: AgreementDetailsV2): string {
	const protocolName = details.name;

	const contacts = details.contact.map((contact) => [contact.contact, contact.name]);
	const chains = details.chains.map((chain) => {
		const chainId = chain.id;

		const accounts = chain.accounts.map((account) => {
			let childScopeNumber = childContractScopeToNumber(account.childContractScope);
			return [account.address, childScopeNumber];
		});

		return [chain.assetRecoveryAddress, accounts, chainId];
	});

	let identity = identityToNumber(details.bountyTerms.identity);
	const bountyTerms = [
		details.bountyTerms.bountyPercentage,
		details.bountyTerms.bountyCapUSD,
		details.bountyTerms.retainable,
		identity,
		details.bountyTerms.diligenceRequirements,
		details.bountyTerms.aggregateBountyCapUSD
	];

	const agreementURI = details.agreementURI;

	const tuple = [protocolName, contacts, chains, bountyTerms, agreementURI];

	return JSON.stringify(tuple, null, 4);
}

// Default factory functions
export function createDefaultAgreementDetails(): AgreementDetailsV2 {
	return {
		name: '',
		contact: [createDefaultContact()],
		chains: [createDefaultChain()],
		bountyTerms: createDefaultBountyTerms(),
		agreementURI: 'https://bafybeigvd7z4iemq7vrdcczgyu2afm7egxwrggftiplydc3vdrdmgccwvu.ipfs.w3s.link/The_SEAL_Whitehat_Safe_Harbor_Agremeent_V1_01.pdf'
	};
}

export function createDefaultBountyTerms(): BountyTerms {
	return {
		bountyCapUSD: 1_000_000,
		bountyPercentage: 10,
		diligenceRequirements: '',
		identity: 'Anonymous',
		retainable: false,
		aggregateBountyCapUSD: 0
	};
}

export function createDefaultChain(): Chain {
	return {
		id: '',
		assetRecoveryAddress: '',
		accounts: [createDefaultAccount()]
	};
}

export function createDefaultAccount(): Account {
	return {
		name: '',
		address: '',
		childContractScope: 'All',
		children: []
	};
}

export function createDefaultContact(): Contact {
	return {
		name: '',
		contact: ''
	};
}