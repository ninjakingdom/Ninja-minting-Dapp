import React from 'react';
import { ethers, BigNumber } from 'ethers'
import { ExternalProvider, Web3Provider } from '@ethersproject/providers';
import detectEthereumProvider from '@metamask/detect-provider';
import NftContractType from '../lib/NftContractType';
import CollectionConfig from '../../../../smart-contract/config/CollectionConfig';
import NetworkConfigInterface from '../../../../smart-contract/lib/NetworkConfigInterface';
import CollectionStatus from './CollectionStatus';
import MintWidget from './MintWidget';
import Whitelist from '../lib/Whitelist';
import { toast } from 'react-toastify';

// const ContractAbi = require('../../../../smart-contract/artifacts/contracts/' + CollectionConfig.contractName + '.sol/' + CollectionConfig.contractName + '.json').abi;

const ContractAbi = require('../../../../smart-contract/artifacts/contracts/NinjaTesting.sol/' + 'NinjaTesting.json').abi;

interface Props {
}

interface State {
  userAddress: string | null;
  network: ethers.providers.Network | null;
  networkConfig: NetworkConfigInterface;
  totalSupply: number;
  maxSupply: number;
  maxMintAmountPerTx: number;
  tokenPrice: BigNumber;
  isPaused: boolean;
  loading: boolean;
  mintSuccess: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  merkleProofManualAddress: string;
  merkleProofManualAddressFeedbackMessage: string | JSX.Element | null;
  errorMessage: string | JSX.Element | null;
  errorMetaMessage: string | JSX.Element | null;
}

const defaultState: State = {
  userAddress: null,
  network: null,
  networkConfig: CollectionConfig.mainnet,
  totalSupply: 0,
  maxSupply: 0,
  maxMintAmountPerTx: 0,
  tokenPrice: BigNumber.from(0),
  isPaused: true,
  loading: false,
  mintSuccess: false,
  isWhitelistMintEnabled: false,
  isUserInWhitelist: false,
  merkleProofManualAddress: '',
  merkleProofManualAddressFeedbackMessage: null,
  errorMessage: null,
  errorMetaMessage: null,
};

export default class Dapp extends React.Component<Props, State> {
  provider!: Web3Provider;

  contract!: NftContractType;

  private merkleProofManualAddressInput!: HTMLInputElement;

  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  componentDidMount = async () => {
    const browserProvider = await detectEthereumProvider() as ExternalProvider;

    if (browserProvider?.isMetaMask !== true) {
      this.setMetaError(
        <>
          Please install <strong>MetaMask</strong> in your web browser.
        </>,
      );
    }

    this.provider = new ethers.providers.Web3Provider(browserProvider);

    this.registerWalletEvents(browserProvider);

    await this.initWallet();
  }

  async mintTokens(amount: number): Promise<void> {
    try {
      const transaction = await this.contract.mint(amount, { value: this.state.tokenPrice.mul(amount) });
      this.setState({ loading: true });

      // toast.info(<>
      //   Transaction sent! Please wait...<br />
      //   <a href={this.generateTransactionUrl(transaction.hash)} target="_blank" rel="noopener">View on {this.state.networkConfig.blockExplorer.name}</a>
      // </>);

      const receipt = await transaction.wait();

      // toast.success(<>
      //   Success!<br />
      //   <a href={this.generateTransactionUrl(receipt.transactionHash)} target="_blank" rel="noopener">View on {this.state.networkConfig.blockExplorer.name}</a>
      // </>);

      this.refreshContractState();
      this.setState({ mintSuccess: true });
    } catch (e) {
      this.setError(e);
      this.setState({ loading: false });
    }
  }

  async whitelistMintTokens(amount: number): Promise<void> {
    try {
      const transaction = await this.contract.whitelistMint(amount, Whitelist.getProofForAddress(this.state.userAddress!), { value: this.state.tokenPrice.mul(amount) });
      this.setState({ loading: true });

      // toast.info(<>
      //   Transaction sent! Please wait...<br />
      //   <a href={this.generateTransactionUrl(transaction.hash)} target="_blank" rel="noopener">View on {this.state.networkConfig.blockExplorer.name}</a>
      // </>);

      const receipt = await transaction.wait();

      // toast.success(<>
      //   Success!<br />
      //   <a href={this.generateTransactionUrl(receipt.transactionHash)} target="_blank" rel="noopener">View on {this.state.networkConfig.blockExplorer.name}</a>
      // </>);

      this.refreshContractState();
      this.setState({ mintSuccess: true });
    } catch (e) {
      this.setError(e);
      this.setState({ loading: false });
    }
  }

  private isWalletConnected(): boolean {
    return this.state.userAddress !== null;
  }

  private isContractReady(): boolean {
    return this.contract !== undefined;
  }

  private isSoldOut(): boolean {
    return this.state.maxSupply !== 0 && this.state.totalSupply >= this.state.maxSupply;
  }

  private isNotMainnet(): boolean {
    return this.state.network !== null && this.state.network.chainId !== CollectionConfig.mainnet.chainId;
  }

  private copyMerkleProofToClipboard(): void {
    const merkleProof = Whitelist.getRawProofForAddress(this.state.userAddress ?? this.state.merkleProofManualAddress);

    if (merkleProof.length < 1) {
      this.setState({
        merkleProofManualAddressFeedbackMessage: 'The given address is not in the whitelist, please double-check.',
      });

      return;
    }

    navigator.clipboard.writeText(merkleProof);
  }

  render() {
    return (
      <>
        <div className='bgContainer'>
          <video
            autoPlay
            loop
            muted
            playsInline
            className='bg'
          >
            <source
              // eslint-disable-next-line max-len
              src="MintPage.mov"
              type="video/mp4" />
          </video>
          <img className='logo' src='logo-NL.png' />

          {this.state.errorMetaMessage ? <div className="error-message"><strong>{this.state.errorMetaMessage}</strong></div> : null}

          {/* <div className='close-button' onClick={() => this.setError()}>X</div> */}

          {this.isWalletConnected() ?
            <>
              {this.isContractReady() ?
                <>
                  {this.state.loading ?
                    <>
                      {this.state.mintSuccess ?
                        <>
                          <div className="wallet-address">
                            <span className="address">{this.state.userAddress?.toString().slice(0, 5)}...{this.state.userAddress?.toString().slice(-4)}</span>
                          </div>
                          <h1 className='txn-success'>TRANSACTION WAS SUCCESSFUL</h1>
                          <h1 className='congratz-msg'>
                            CONGRATULATIONS!
                            <br />
                            WELCOME TO THE NINJA KINGDOM!
                          </h1>
                          <a className='ethscan'>VIEW ETHERSCAN</a>
                          <a className='jonin' >CLAIM YOUR JŌNIN ROLE</a>
                        </>
                        :
                        <>
                          <div className="wallet-address">
                            <span className="address">{this.state.userAddress?.toString().slice(0, 5)}...{this.state.userAddress?.toString().slice(-4)}</span>
                          </div>
                          <h1 className='select'>TRANSACTION IS PROCESSING...</h1>
                          <h1 className='update-message'>UPDATING... DO NOT REFRESH THE BROWSER</h1>
                          <a className='ethscan'>VIEW ETHERSCAN</a>
                        </>
                      }
                    </>
                    :
                    <>
                      <CollectionStatus
                        userAddress={this.state.userAddress}
                        maxSupply={this.state.maxSupply}
                        totalSupply={this.state.totalSupply}
                        isPaused={this.state.isPaused}
                        isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                        isUserInWhitelist={this.state.isUserInWhitelist}
                        isSoldOut={this.isSoldOut()}
                        errorMessage={this.state.errorMessage}

                      />
                      {!this.isSoldOut() ?
                        <MintWidget
                          networkConfig={this.state.networkConfig}
                          maxSupply={this.state.maxSupply}
                          totalSupply={this.state.totalSupply}
                          tokenPrice={this.state.tokenPrice}
                          maxMintAmountPerTx={this.state.maxMintAmountPerTx}
                          isPaused={this.state.isPaused}
                          isWhitelistMintEnabled={this.state.isWhitelistMintEnabled}
                          isUserInWhitelist={this.state.isUserInWhitelist}
                          mintTokens={(mintAmount) => this.mintTokens(mintAmount)}
                          whitelistMintTokens={(mintAmount) => this.whitelistMintTokens(mintAmount)}
                          loading={this.state.loading}
                        />
                        :
                        <div className="WL-fail">
                          <h2>The Ninja's have been <strong>sold out</strong>!</h2>
                          <h3>You can visit our collection in <a href={this.generateMarketplaceUrl()} target="_blank">{CollectionConfig.marketplaceConfig.name}</a>.</h3>
                        </div>
                      }
                    </>
                  }
                </>
                :
                null
              }
            </>
            :
            <div>
              {!this.isWalletConnected() && !this.state.errorMetaMessage
                ? <>
                  <div className='readyninja'> READY TO BE A NINJA? </div>
                  <button className="connect-wallet" disabled={this.provider === undefined} onClick={() => this.connectWallet()}>CONNECT WALLET</button> </>
                : null}
            </div>
          }
        </div>
      </>
    );
  }

  private setError(error: any = null): void {
    let errorMessage = 'Unknown error...';

    if (null === error || typeof error === 'string') {
      errorMessage = error;
    } else if (typeof error === 'object') {
      // Support any type of error from the Web3 Provider...
      if (error?.error?.message !== undefined) {
        errorMessage = error.error.message;
      } else if (error?.data?.message !== undefined) {
        errorMessage = error.data.message;
      } else if (error?.message !== undefined) {
        errorMessage = error.message;
      } else if (React.isValidElement(error)) {
        this.setState({ errorMessage: error });

        return;
      }
    }

    this.setState({
      errorMessage: null === errorMessage ? null : errorMessage.charAt(0).toUpperCase() + errorMessage.slice(1),
    });
  }

  private setMetaError(error: any = null): void {
    let errorMetaMessage = 'Unknown error...';

    if (null === error || typeof error === 'string') {
      errorMetaMessage = error;
    } else if (typeof error === 'object') {
      // Support any type of error from the Web3 Provider...
      if (error?.error?.message !== undefined) {
        errorMetaMessage = error.error.message;
      } else if (error?.data?.message !== undefined) {
        errorMetaMessage = error.data.message;
      } else if (error?.message !== undefined) {
        errorMetaMessage = error.message;
      } else if (React.isValidElement(error)) {
        this.setState({ errorMetaMessage: error });

        return;
      }
    }

    this.setState({
      errorMetaMessage: null === errorMetaMessage ? null : errorMetaMessage.charAt(0).toUpperCase() + errorMetaMessage.slice(1),
    });
  }

  private generateContractUrl(): string {
    return this.state.networkConfig.blockExplorer.generateContractUrl(CollectionConfig.contractAddress!);
  }

  private generateMarketplaceUrl(): string {
    return CollectionConfig.marketplaceConfig.generateCollectionUrl(CollectionConfig.marketplaceIdentifier, !this.isNotMainnet());
  }

  private generateTransactionUrl(transactionHash: string): string {
    return this.state.networkConfig.blockExplorer.generateTransactionUrl(transactionHash);
  }

  private async connectWallet(): Promise<void> {
    try {
      await this.provider.provider.request!({ method: 'eth_requestAccounts' });
      this.initWallet();
    } catch (e) {
      this.setError(e);
    }
  }

  private async refreshContractState(): Promise<void> {
    this.setState({
      maxSupply: (await this.contract.maxSupply()).toNumber(),
      totalSupply: (await this.contract.totalSupply()).toNumber(),
      maxMintAmountPerTx: (await this.contract.maxMintAmountPerTx()).toNumber(),
      tokenPrice: await this.contract.cost(),
      isPaused: await this.contract.paused(),
      isWhitelistMintEnabled: await this.contract.whitelistMintEnabled(),
      isUserInWhitelist: Whitelist.contains(this.state.userAddress ?? ''),
    });
  }

  private async initWallet(): Promise<void> {
    const walletAccounts = await this.provider.listAccounts();

    this.setState(defaultState);

    if (walletAccounts.length === 0) {
      return;
    }

    const network = await this.provider.getNetwork();
    let networkConfig: NetworkConfigInterface;

    if (network.chainId === CollectionConfig.mainnet.chainId) {
      networkConfig = CollectionConfig.mainnet;
    } else if (network.chainId === CollectionConfig.testnet.chainId) {
      networkConfig = CollectionConfig.testnet;
    } else {
      this.setError('Please switch to the Ethereum Main Network!');

      return;
    }

    this.setState({
      userAddress: walletAccounts[0],
      network,
      networkConfig,
    });

    if (await this.provider.getCode(CollectionConfig.contractAddress!) === '0x') {
      this.setError('Could not find the contract, are you connected to the right chain?');

      return;
    }

    this.contract = new ethers.Contract(
      CollectionConfig.contractAddress!,
      ContractAbi,
      this.provider.getSigner(),
    ) as NftContractType;

    this.refreshContractState();
  }

  private registerWalletEvents(browserProvider: ExternalProvider): void {
    // @ts-ignore
    browserProvider.on('accountsChanged', () => {
      this.initWallet();
    });

    // @ts-ignore
    browserProvider.on('chainChanged', () => {
      window.location.reload();
    });
  }
}
