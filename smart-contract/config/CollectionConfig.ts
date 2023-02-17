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
  tokenName: 'TheNinjaKingdom',
  tokenSymbol: 'TNK',
  hiddenMetadataUri: 'ipfs://QmXiMt2a8WJxj4QRAQRehsRwjkbHUYiHuBSfqzbzmoVoDU/hidden.json',
  maxSupply: 100,
  whitelistSale: {
    price: 0.01,
    maxMintAmountPerTx: 2,
  },
  preSale: {
    price: 0.02,
    maxMintAmountPerTx: 3,
  },
  publicSale: {
    price: 0.02,
    maxMintAmountPerTx: 3,
  },
  contractAddress: "0x227dc2013094e1c9f4267855da687d838e5ef8c5",
  marketplaceIdentifier: 'ninjakingdom-token',
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses,
  royaltyFeesInBips: "250",
};

export default CollectionConfig;
