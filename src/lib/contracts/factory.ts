import { createWalletClient, custom, createPublicClient, http, type Address, type Hash } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import type { AgreementDetailsV2 } from '$lib/firebase/types/agreementDetailsV2';
import { CONTRACT_ADDRESSES } from './config';
import FACTORY_ABI from './factory_abi.json';

const FACTORY_ADDRESS = CONTRACT_ADDRESSES.FACTORY;
const REGISTRY_ADDRESS = CONTRACT_ADDRESSES.REGISTRY;

export async function connectWallet(): Promise<Address> {
	if (typeof window === 'undefined' || !window.ethereum) {
		throw new Error('MetaMask or compatible wallet not found');
	}

	await window.ethereum.request({
		method: 'eth_requestAccounts'
	});

	const chain = await getSupportedChain();

	const walletClient = createWalletClient({
		chain,
		transport: custom(window.ethereum)
	});

	const [account] = await walletClient.getAddresses();
	if (!account) {
		throw new Error('No wallet account found. Please connect your wallet.');
	}

	return account;
}

export async function deployAgreement(
	agreementDetails: AgreementDetailsV2,
	owner?: Address | undefined,
): Promise<{ hash: Hash; agreementAddress?: Address }> {
	if (typeof window === 'undefined' || !window.ethereum) {
		throw new Error('MetaMask or compatible wallet not found');
	}

	const chain = await getSupportedChain();

	await window.ethereum.request({
		method: 'eth_requestAccounts'
	});
	const walletClient = createWalletClient({
		chain,
		transport: custom(window.ethereum)
	});

	const publicClient = createPublicClient({
		chain,
		transport: http()
	});

	const [account] = await walletClient.getAddresses();
	if (!account) {
		throw new Error('No wallet account found. Please connect your wallet.');
	}
	const contractData = transformToContractData(agreementDetails);

	const ownerAddress = owner || account;

	try {
		// Use high gas limit for simulation
		// This avoids RPC provider gas estimation limits
		const gasLimit = 5_000_000n;

		const { request } = await publicClient.simulateContract({
			address: FACTORY_ADDRESS,
			abi: FACTORY_ABI,
			functionName: 'create',
			args: [contractData, REGISTRY_ADDRESS, ownerAddress],
			account,
			gas: gasLimit
		});

		const hash = await walletClient.writeContract({
			...request
		});

		await publicClient.waitForTransactionReceipt({ hash });
		return { hash };
	} catch (error: any) {
		if (error.message?.includes('User rejected')) {
			throw new Error('Transaction was rejected by user');
		}

		throw error;
	}
}

async function getSupportedChain() {
	if (typeof window === 'undefined' || !window.ethereum) {
		throw new Error('MetaMask or compatible wallet not found');
	}

	const chainId = await window.ethereum.request({ method: 'eth_chainId' });
	const chainIdNumber = parseInt(chainId, 16);

	if (chainIdNumber === 1) {
		return mainnet;
	} else if (chainIdNumber === 11155111) {
		return sepolia;
	} else {
		throw new Error(`Unsupported network. Please switch to Ethereum Mainnet or Sepolia Testnet. Current chain ID: ${chainIdNumber}`);
	}
}

function transformToContractData(details: AgreementDetailsV2) {
	const contactDetails = details.contact.map(contact => ({
		name: contact.name,
		contact: contact.contact
	}));

	const chains = details.chains.map(chain => ({
		assetRecoveryAddress: chain.assetRecoveryAddress,
		accounts: chain.accounts.map(account => ({
			accountAddress: account.address,
			childContractScope: (() => {
				switch (account.childContractScope) {
					case 'None': return 0;
					case 'ExistingOnly': return 1;
					case 'All': return 2;
					case 'FutureOnly': return 3;
					default: return 0;
				}
			})()
		})),
		caip2ChainId: chain.id
	}));

	const bountyTerms = {
		bountyPercentage: Number(details.bountyTerms.bountyPercentage),
		bountyCapUSD: Number(details.bountyTerms.bountyCapUSD),
		retainable: details.bountyTerms.retainable,
		identity: (() => {
			switch (details.bountyTerms.identity) {
				case 'Anonymous': return 0;
				case 'Pseudonymous': return 1;
				case 'Named': return 2;
				default: return 0;
			}
		})(),
		diligenceRequirements: details.bountyTerms.diligenceRequirements,
		aggregateBountyCapUSD: Number(details.bountyTerms.aggregateBountyCapUSD)
	};

	return {
		protocolName: details.name,
		contactDetails,
		chains,
		bountyTerms,
		agreementURI: details.agreementURI
	};
}
