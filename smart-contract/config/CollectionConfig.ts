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
  contractName: 'TheNinjaKingdomOfficial',
  tokenName: 'The Ninja Kingdom Official',
  tokenSymbol: 'TNJK',
  hiddenMetadataUri: 'ipfs://QmXiMt2a8WJxj4QRAQRehsRwjkbHUYiHuBSfqzbzmoVoDU/hidden.json',
  maxSupply: 100,
  whitelistSale: {
    price: 0.001,
    maxMintAmountPerTx: 2,
  },
  preSale: {
    price: 0.002,
    maxMintAmountPerTx: 3,
  },
  publicSale: {
    price: 0.002,
    maxMintAmountPerTx: 3,
  },
  contractAddress: "0x85bB3b8D2597729DAC4a58c155FF0a5d83A0caA5",
  marketplaceIdentifier: 'ninjakingdom-token',
  marketplaceConfig: Marketplaces.openSea,
  whitelistAddresses,
  royaltyFeesInBips: "500",
};

export default CollectionConfig;
