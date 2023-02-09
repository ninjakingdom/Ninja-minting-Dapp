import CollectionConfigInterface from '../lib/CollectionConfigInterface';
import * as Networks from '../lib/Networks';
import * as Marketplaces from '../lib/Marketplaces';
import whitelistAddresses from './whitelist.json';

const CollectionConfig: CollectionConfigInterface = {
  testnet: Networks.ethereumTestnet,
  mainnet: Networks.ethereumMainnet,
  // The contract name can be updated using the following command:
  // yarn rename-contract NEW_CONTRACT_NAME
  // Please DO NOT change it manually!
  contractName: 'TheNinjaKingdom',
  tokenName: 'The Ninja Kingdom',
  tokenSymbol: 'TNK',
  hiddenMetadataUri: 'ipfs://QmXiMt2a8WJxj4QRAQRehsRwjkbHUYiHuBSfqzbzmoVoDU/hidden.json',
  maxSupply: 20,
  whitelistSale: {
    price: 0.06,
    maxMintAmountPerTx: 2,
  },
  preSale: {
    price: 0.07,
    maxMintAmountPerTx: 3,
  },
  publicSale: {
    price: 0.07,
    maxMintAmountPerTx: 3,
  },
  contractAddress: "0xe8EC1f935779C633cf7Bc714a22CB20Edc599C90",
  marketplaceIdentifier: 'ninjakingdom-token',
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses,
};

export default CollectionConfig;
