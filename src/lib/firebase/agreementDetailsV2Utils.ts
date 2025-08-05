import type { AgreementDetailsV2, Account, Chain, BountyTerms, Contact } from './types/agreementDetailsV2';

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

/**
 * Generates JSON string representation of agreement details
 */
export function generateAgreementJSON(details: AgreementDetailsV2): string {
	return JSON.stringify(details, null, 2);
}

/**
 * Generates blockchain tuple representation of agreement details
 */
export function generateAgreementTuple(details: AgreementDetailsV2): string {
	const protocolName = details.name;

	const contacts = details.contact.map((contact) => [contact.contact, contact.name]);
	const chains = details.chains.map((chain) => {
		const chainId = chain.id;

		const accounts = chain.accounts.map((account) => {
			let childScopeNumber;
			switch (account.childContractScope) {
				case 'None':
					childScopeNumber = 0;
					break;
				case 'ExistingOnly':
					childScopeNumber = 1;
					break;
				case 'All':
					childScopeNumber = 2;
					break;
				case 'FutureOnly':
					childScopeNumber = 3;
					break;
				default:
					childScopeNumber = 0;
			}

			return [account.address, childScopeNumber];
		});

		return [chain.assetRecoveryAddress, accounts, chainId];
	});

	let identity;
	switch (details.bountyTerms.identity) {
		case 'Anonymous':
			identity = 0;
			break;
		case 'Pseudonymous':
			identity = 1;
			break;
		case 'Named':
			identity = 2;
			break;
		default:
			identity = 0;
	}

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

/**
 * Creates a new default Account instance
 * @returns Default Account with empty values and "None" scope
 */
export function createDefaultAccount(): Account {
	return {
		name: '',
		address: '',
		childContractScope: 'All',
		children: []
	};
}

/**
 * Creates a new default Chain instance
 * @returns Default Chain with empty values and one default account
 */
export function createDefaultChain(): Chain {
	return {
		id: '',
		assetRecoveryAddress: '',
		accounts: [createDefaultAccount()]
	};
}

/**
 * Creates a new default Contact instance
 * @returns Default Contact with empty name and contact fields
 */
export function createDefaultContact(): Contact {
	return {
		name: '',
		contact: ''
	};
}

/**
 * Creates a new default BountyTerms instance
 * @returns Default BountyTerms with sensible defaults (10%, $1M cap, Anonymous, not retainable)
 */
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

/**
 * Creates a new default AgreementDetailsV2 instance
 * @returns Default AgreementDetailsV2 with one contact, one chain, and default bounty terms
 */
export function createDefaultAgreementDetails(): AgreementDetailsV2 {
	return {
		name: '',
		contact: [createDefaultContact()],
		chains: [createDefaultChain()],
		bountyTerms: createDefaultBountyTerms(),
		agreementURI: 'https://bafybeigvd7z4iemq7vrdcczgyu2afm7egxwrggftiplydc3vdrdmgccwvu.ipfs.w3s.link/The_SEAL_Whitehat_Safe_Harbor_Agremeent_V1_01.pdf'
	};
}