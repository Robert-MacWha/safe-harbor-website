import type { ChainID } from "./firebase/types/chain";

export interface Chain {
    Name: string;
    ID: number;
    Icon: string;
    Scan: string;
    TXScan: string;
    AddressScan: string;
};

export const Chains: Chain[] = [
    {
        Name: "Ethereum",
        ID: 1,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_ethereum.jpg?w=48&h=48",
        Scan: "https://etherscan.io",
        TXScan: "https://etherscan.io/tx/{tx}",
        AddressScan: "https://etherscan.io/address/{address}",
    },
    {
        Name: "BSC",
        ID: 56,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_binance.jpg?w=48&h=48",
        Scan: "https://bscscan.com",
        TXScan: "https://bscscan.io/tx/{tx}",
        AddressScan: "https://bscscan.io/address/{address}",
    },
    {
        Name: "Arbitrum",
        ID: 42161,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_arbitrum.jpg?w=48&h=48",
        Scan: "https://arbiscan.io",
        TXScan: "https://arbiscan.io/tx/{tx}",
        AddressScan: "https://arbiscan.io/address/{address}",
    },
    {
        Name: "Polygon",
        ID: 137,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_polygon.jpg?w=48&h=48",
        Scan: "https://polygonscan.com",
        TXScan: "https://polygonscan.com/tx/{tx}",
        AddressScan: "https://polygonscan.com/address/{address}",
    },
    {
        Name: "Base",
        ID: 8453,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_base.jpg?w=48&h=48",
        Scan: "https://basescan.io",
        TXScan: "https://basescan.io/tx/{tx}",
        AddressScan: "https://basescan.io/address/{address}",
    },
    {
        Name: "Avalanche",
        ID: 43114,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_avalanche.jpg?w=48&h=48",
        Scan: "https://avascan.info",
        TXScan: "https://avascan.info/blockchain/dfk/tx/{tx}",
        AddressScan: "https://avascan.info/blockchain/dfk/address/{address}",
    },
    {
        Name: "Optimism",
        ID: 10,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_optimism?w=48&h=48",
        Scan: "https://optimistic.etherscan.io",
        TXScan: "https://optimistic.etherscan.io/tx/{tx}",
        AddressScan: "https://optimistic.etherscan.io/address/{address}",
    },
    {
        Name: "Tron",
        ID: 728126428,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_tron.jpg?w=48&h=48",
        Scan: "https://tronscan.io",
        TXScan: "https://tronscan.io/#/transaction/{tx}",
        AddressScan: "https://tronscan.io/#/address/{address}",
    },
    {
        Name: "Moonbeam",
        ID: 1284,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_moonbeam.jpg?w=48&h=48",
        Scan: "https://moonscan.io",
        TXScan: "https://moonscan.io/tx/{tx}",
        AddressScan: "https://moonscan.io/address/{address}",
    },
    {
        Name: "Moonriver",
        ID: 1285,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_moonriver.jpg?w=48&h=48",
        Scan: "https://moonriver.moonscan.io",
        TXScan: "https://moonriver.moonscan.io/tx/{tx}",
        AddressScan: "https://moonriver.moonscan.io/address/{address}",
    },
    {
        Name: "Fraxtal",
        ID: 252,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_fraxtal.jpg",
        Scan: "https://fraxscan.com",
        TXScan: "https://fraxscan.com/tx/{tx}",
        AddressScan: "https://fraxscan.com/address/{address}",
    },
    {
        Name: "Gnosis",
        ID: 100,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_xdai.jpg",
        Scan: "https://gnosisscan.io",
        TXScan: "https://gnosisscan.io/tx/{tx}",
        AddressScan: "https://gnosisscan.io/address/{address}",
    },
    {
        Name: "Mode",
        ID: 34443,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_mode?w=48&h=48",
        Scan: "https://modescan.io",
        TXScan: "https://modescan.io/tx/{tx}",
        AddressScan: "https://modescan.io/address/{address}",
    },
    {
        Name: "Polygon ZkEVM",
        ID: 1101,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_polygon%20zkevm.jpg",
        Scan: "https://zkevm.polygonscan.com",
        TXScan: "https://zkevm.polygonscan.com/tx/{tx}",
        AddressScan: "https://zkevm.polygonscan.com/address/{address}",
    },
    {
        Name: "Sonic",
        ID: 146,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_sonic.jpg",
        Scan: "https://sonicscan.org",
        TXScan: "https://sonicscan.org/tx/{tx}",
        AddressScan: "https://sonicscan.org/address/{address}",
    },
    {
        Name: "Blast",
        ID: 81457,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_blast.jpg",
        Scan: "https://blastscan.io/",
        TXScan: "https://blastscan.io/tx/{tx}",
        AddressScan: "https://blastscan.io/address/{address}",
    },
    {
        Name: "Boba",
        ID: 288,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_boba.jpg",
        Scan: "http://bobascan.com/",
        TXScan: "http://bobascan.com/tx/{tx}",
        AddressScan: "http://bobascan.com/address/{address}",
    },
    {
        Name: "Celo",
        ID: 42220,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_celo.jpg",
        Scan: "https://celoscan.io/",
        TXScan: "https://celoscan.io/tx/{tx}",
        AddressScan: "https://celoscan.io/address/{address}",
    },
    {
        Name: "Filecoin",
        ID: 314,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_filecoin.jpg",
        Scan: "https://filscan.io/",
        TXScan: "https://filscan.io/tx/{tx}",
        AddressScan: "https://filscan.io/address/{address}",
    },
    {
        Name: "Linea",
        ID: 59144,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_linea.jpg",
        Scan: "https://lineascan.build/",
        TXScan: "https://lineascan.build/tx/{tx}",
        AddressScan: "https://lineascan.build/address/{address}",
    },
    {
        Name: "Manta Pacific",
        ID: 169,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_manta.jpg",
        Scan: "https://manta.socialscan.io",
        TXScan: "https://manta.socialscan.io/tx/{tx}",
        AddressScan: "https://manta.socialscan.io/address/{address}",
    },
    {
        Name: "Mantle",
        ID: 5000,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_mantle.jpg",
        Scan: "https://explorer.mantle.xyz",
        TXScan: "https://explorer.mantle.xyz/tx/{tx}",
        AddressScan: "https://explorer.mantle.xyz/address/{address}",
    },
    {
        Name: "Berachain",
        ID: 80094,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_berachain.jpg",
        Scan: "https://berascan.com/",
        TXScan: "https://berascan.com/tx/{tx}",
        AddressScan: "https://berascan.com/address/{address}",
    },
];

export function GetChain(id: ChainID): Chain | undefined {
    if (typeof id === 'number') {
        return GetChainByID(id);
    } else if (typeof id === 'string') {
        return GetChainByCaip(id);
    }

    return undefined;
}

function GetChainByID(id: number): Chain | undefined {
    return Chains.find((chain) => chain.ID == id);
}

function GetChainByCaip(caip: string): Chain | undefined {
    console.error("TODO: Implement GetChainByCaip");
    return undefined;
} 
