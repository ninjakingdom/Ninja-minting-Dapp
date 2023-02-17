import NftContractProvider from '../lib/NftContractProvider';

async function main() {
  if (undefined === process.env.COLLECTION_URI_PREFIX || process.env.COLLECTION_URI_PREFIX === 'ipfs://__CID___/') {
    throw '\x1b[31merror\x1b[0m ' + 'Please add the URI prefix to the ENV configuration before running this command.';
  }

  // Attach to deployed contract
  const contract = await NftContractProvider.getContract();

  // Withdrawing funds from the contract (if needed)
  console.log('Withdrawing funds from the contract...');

  await (await contract.withdraw()).wait();

  console.log('Withdraw Successful!');
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
