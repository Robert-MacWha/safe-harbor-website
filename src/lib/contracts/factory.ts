import { createWalletClient, createPublicClient, http, type Address, type Hash, custom, type Chain } from 'viem';
import { mainnet, sepolia } from 'viem/chains';
import type { AgreementDetailsV2 } from '$lib/firebase/types/agreementDetailsV2';
import { CONTRACT_ADDRESSES } from './config';
import FACTORY_ABI from './factory_abi.json';
import type { Chain as OnboardChain } from '@web3-onboard/common';
import Onboard, { type WalletState } from '@web3-onboard/core'
import injectedModule from '@web3-onboard/injected-wallets'

const FACTORY_ADDRESS = CONTRACT_ADDRESSES.FACTORY;
const REGISTRY_ADDRESS = CONTRACT_ADDRESSES.REGISTRY;

const CHAIN_MAP: Record<string, Chain> = {
	'0x1': mainnet,
	'0xaa36a7': sepolia,
};

export async function connectWallet(): Promise<WalletState> {
	const injected = injectedModule()

	const onboard = Onboard({
		wallets: [injected],
		chains: chainMapToOnboardChains(),
	})

	const wallets = await onboard.connectWallet()
	const wallet = wallets[0]
	return wallet;
}

export async function deployAgreement(
	wallet: WalletState,
	agreementDetails: AgreementDetailsV2,
	owner?: Address | undefined,
): Promise<{ hash: Hash; agreementAddress?: Address }> {
	const chain = getCurrentChain(wallet);

	const walletClient = createWalletClient({
		transport: custom(wallet.provider),
		chain: chain,
	})
	const publicClient = createPublicClient({
		transport: custom(wallet.provider),
		chain: chain,
	});

	const account = wallet.accounts[0].address;
	if (!account) {
		throw new Error('No wallet account found. Please connect your wallet.');
	}
	const ownerAddress = owner || account;

	const contractData = transformToContractData(agreementDetails);
	let request;
	try {
		const res = await publicClient.simulateContract({
			address: FACTORY_ADDRESS,
			abi: FACTORY_ABI,
			functionName: 'create',
			args: [contractData, REGISTRY_ADDRESS, ownerAddress],
			account,
		});

		request = res.request;
	} catch (error: any) {
		throw new Error(`Simulation failed: ${error.message || error}`);
	}

	try {
		const hash = await walletClient.writeContract({
			...request
		});

		await publicClient.waitForTransactionReceipt({ hash });
		return { hash };
	} catch (error: any) {
		if (error.message?.includes('User rejected')) {
			throw new Error('Transaction was rejected by user');
		}

		throw new Error(`Transaction failed: ${error.message || error}`);
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
		caip2ChainId: chain.caip2ChainId
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

function getCurrentChain(wallet: WalletState): Chain {
	const chainId = wallet.chains[0]?.id;
	if (!chainId) {
		throw new Error('No chain detected in wallet');
	}

	const chain = CHAIN_MAP[chainId];
	if (!chain) {
		throw new Error(`Unsupported chain: ${chainId}. Please switch to a supported network.`);
	}

	return chain;
}

function chainMapToOnboardChains(): OnboardChain[] {
	return Object.entries(CHAIN_MAP).map(([id, chain]) => ({
		id,
		rpcUrl: chain.rpcUrls.default.http[0],
		label: chain.name,
		token: chain.nativeCurrency.symbol,
	}));
}