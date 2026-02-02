import type { ChainID } from "./firebase/types/chain";

export interface Chain {
    Name: string;
    ID: number;
    Caip2ID?: string | undefined;
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
        Scan: "https://basescan.org",
        TXScan: "https://basescan.org/tx/{tx}",
        AddressScan: "https://basescan.org/address/{address}",
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
    // NOTE: PolygonZKEVM seems like it's being deprecated, so not sure if we should keep this
    {
        Name: "Polygon ZkEVM",
        ID: 1101,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_polygon%20zkevm.jpg",
        Scan: "https://www.oklink.com/polygon-zkevm",
        TXScan: "https://www.oklink.com/polygon-zkevm/tx/{tx}",
        AddressScan: "https://www.oklink.com/polygon-zkevm/address/{address}",
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
        ID: 690,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_berachain.jpg",
        Scan: "https://berascan.com/",
        TXScan: "https://berascan.com/tx/{tx}",
        AddressScan: "https://berascan.com/address/{address}",
    },
    {
        Name: "Unichain",
        ID: 30,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_unichain.jpg",
        Scan: "https://unichain.blockscout.com/",
        TXScan: "https://unichain.blockscout.com/tx/{tx}",
        AddressScan: "https://unichain.blockscout.com/address/{address}",
    },
    {
        Name: "Scroll",
        ID: 534352,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_scroll.jpg",
        Scan: "https://scrollscan.com/",
        TXScan: "https://scrollscan.com/tx/{tx}",
        AddressScan: "https://scrollscan.com/address/{address}",
    },
    {
        Name: "Sei Network",
        ID: 1329,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_sei.jpg",
        Scan: "https://seistream.app/",
        TXScan: "https://seistream.app/transactions/{tx}",
        AddressScan: "https://seistream.app/account/{address}",
    },
    {
        Name: "Taiko Alethia",
        ID: 167000,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_taiko.jpg",
        Scan: "https://berascan.com/",
        TXScan: "https://taikoscan.io/tx/{tx}",
        AddressScan: "https://taikoscan.io/address/{address}",
    },
    {
        Name: "World Chain",
        ID: 480,
        Icon: "https://chainlist.org/unknown-logo.png",
        Scan: "https://worldscan.org/",
        TXScan: "https://worldscan.org/tx/{tx}",
        AddressScan: "https://worldscan.org/address/{address}",
    },
    {
        Name: "zkSync Mainnet",
        ID: 324,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_zksync%20era.jpg",
        Scan: "https://explorer.zksync.io/",
        TXScan: "https://explorer.zksync.io/tx/{tx}",
        AddressScan: "https://explorer.zksync.io/address/{address}",
    },
    {
        Name: "Zora",
        ID: 7777777,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_zora.jpg",
        Scan: "https://explorer.zora.energy/",
        TXScan: "https://explorer.zora.energy/tx/{tx}",
        AddressScan: "https://explorer.zora.energy/address/{address}",
    },
    {
        Name: "opBNB Mainnet",
        ID: 204,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_op_bnb.jpg",
        Scan: "https://opbnbscan.com/",
        TXScan: "https://opbnbscan.com/tx/{tx}",
        AddressScan: "https://opbnbscan.com/address/{address}",
    },
    {
        Name: "Metis Andromeda Mainnet",
        ID: 1088,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_metis.jpg",
        Scan: "https://andromeda-explorer.metis.io/",
        TXScan: "https://andromeda-explorer.metis.io/tx/{tx}",
        AddressScan: "https://andromeda-explorer.metis.io/address/{address}",
    },
    {
        Name: "Berachain",
        ID: 80094,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_berachain.jpg",
        Scan: "https://berascan.com",
        TXScan: "https://berascan.com/tx/{tx}",
        AddressScan: "https://berascan.com/address/{address}",
    },
    {
        Name: "Plasma Mainnet",
        ID: 9745,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_plasma.jpg",
        Scan: "https://plasmascan.to/",
        TXScan: "https://plasmascan.to/tx/{tx}",
        AddressScan: "https://plasmascan.to/address/{address}",
    },
    {
        Name: "HyperEVM",
        ID: 999,
        Icon: "https://chainlist.org/unknown-logo.png",
        Scan: "https://purrsec.com/",
        TXScan: "https://purrsec.com/tx/{tx}",
        AddressScan: "https://purrsec.com/address/{address}",
    },
    {
        Name: "Astar zkEVM",
        ID: 3776,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_astar%20zkevm.jpg",
        Scan: "https://docs.astar.network/docs/learn/architecture/astar-zkevm/",
        TXScan: "https://docs.astar.network/docs/learn/architecture/astar-zkevm/",
        AddressScan: "https://docs.astar.network/docs/learn/architecture/astar-zkevm/",
    },
    {
        Name: "Immutable zkEVM",
        ID: 13371,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_immutable%20zkevm.jpg",
        Scan: "https://explorer.immutable.com",
        TXScan: "https://explorer.immutable.com/tx/{tx}",
        AddressScan: "https://explorer.immutable.com/address/{address}",
    },
    {
        Name: "X Layer Mainnet",
        ID: 196,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_x%20layer.jpg",
        Scan: "https://www.oklink.com/xlayer",
        TXScan: "https://www.oklink.com/x-layer/tx/{tx}",
        AddressScan: "https://www.oklink.com/x-layer/address/{address}",
    },
    {
        Name: "Soneium",
        ID: 1868,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_soneium.jpg",
        Scan: "https://soneium.blockscout.com/",
        TXScan: "https://soneium.blockscout.com/tx/{tx}",
        AddressScan: "https://soneium.blockscout.com/address/{address}",
    },
    {
        Name: "Somina Mainnet",
        ID: 5031,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_somnia.jpg",
        Scan: "https://explorer.somnia.network/",
        TXScan: "https://explorer.somnia.network/tx/{tx}",
        AddressScan: "https://explorer.somnia.network/address/{address}",
    },
    {
        Name: "MANTRACHAIN Mainnet",
        ID: 5888,
        Icon: "https://chainlist.org/unknown-logo.png",
        Scan: "https://mantrascan.io",
        TXScan: "https://mantrascan.io/tx/{tx}",
        AddressScan: "https://mantrascan.io/address/{address}",
    },
    {
        Name: "Dogechain Mainnet",
        ID: 2000,
        Icon: "https://icons.llamao.fi/icons/chains/rsz_dogechain.jpg",
        Scan: "https://explorer.dogechain.dog",
        TXScan: "https://explorer.dogechain.dog/tx/{tx}",
        AddressScan: "https://explorer.dogechain.dog/address/{address}",
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
    const chain = Chains.find((chain) => chain.Caip2ID === caip);
    if (chain) {
        return chain;
    }

    // If the caip2ID is not found, check if it starts with "eip155:"
    if (caip.startsWith("eip155:")) {
        const chainID = parseInt(caip.split(":")[1]);
        return GetChainByID(chainID);
    }
} 
