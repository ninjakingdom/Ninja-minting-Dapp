import React from 'react';
import truncateEthAddress from 'truncate-eth-address'

interface Props {
  userAddress: string | null;
  totalSupply: number;
  maxSupply: number;
  isPaused: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  isSoldOut: boolean;
}

interface State {
}

const defaultState: State = {
};

export default class CollectionStatus extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  // public walletAddress = this.props.userAddress;

  private isSaleOpen(): boolean {
    return (this.props.isWhitelistMintEnabled || !this.props.isPaused) && !this.props.isSoldOut;
  }

  render() {
    return (
      <>
        <div className="wallet-address">
          <span className="label">Wallet address:</span> <br />
          <span className="address">{this.props.userAddress?.toString().slice(0, 5)}...{this.props.userAddress?.toString().slice(-4)}</span>
        </div>
        <div className="collection-status">
          <div className="supply-sale">
            <span className="label">Supply: </span>
            {Number(this.props.maxSupply.toString()) - Number(this.props.totalSupply.toString())} left
          </div>

          <div className="supply-sale">
            <span className="label">Sale status: </span>
            {this.isSaleOpen() ?
              <>
                {this.props.isWhitelistMintEnabled ? 'Whitelist only' : 'Open'}
              </>
              :
              'Closed'
            }
          </div>
        </div>
      </>
    );
  }
}
