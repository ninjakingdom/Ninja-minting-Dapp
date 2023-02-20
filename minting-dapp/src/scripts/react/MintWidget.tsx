import { utils, BigNumber } from 'ethers';
import React from 'react';
import NetworkConfigInterface from '../../../../smart-contract/lib/NetworkConfigInterface';
import $ from "jquery";

interface Props {
  networkConfig: NetworkConfigInterface;
  maxSupply: number;
  totalSupply: number;
  tokenPrice: BigNumber;
  maxMintAmountPerTx: number;
  isPaused: boolean;
  loading: boolean;
  isWhitelistMintEnabled: boolean;
  isUserInWhitelist: boolean;
  mintTokens(mintAmount: number): Promise<void>;
  whitelistMintTokens(mintAmount: number): Promise<void>;
}

interface State {
  mintAmount: number;
}

const defaultState: State = {
  mintAmount: 1,
};

export default class MintWidget extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = defaultState;
  }

  private canMint(): boolean {
    return !this.props.isPaused || this.canWhitelistMint();
  }

  private canWhitelistMint(): boolean {
    return this.props.isWhitelistMintEnabled && this.props.isUserInWhitelist;
  }

  private mint3(): void {
    this.setState({
      mintAmount: 3,
    });
  }

  private mint2(): void {
    this.setState({
      mintAmount: 2,
    });
  }

  private mint1(): void {
    this.setState({
      mintAmount: 1,
    });
  }

  private async mint(): Promise<void> {
    if (!this.props.isPaused) {
      await this.props.mintTokens(this.state.mintAmount);

      return;
    }

    await this.props.whitelistMintTokens(this.state.mintAmount);
  }

  render() {
    $('button').on('click', function () {
      $('button').removeClass('selected');
      $(this).addClass('selected');
    });
    return (
      <>
        {this.canMint() ?
          <>
            {/* {this.props.isUserInWhitelist ?
              <> */}
            <div className="pricetag">
              <strong>PRICE:</strong> {utils.formatEther(this.props.tokenPrice.mul(this.state.mintAmount))} ETH
            </div>
            <div className="controls">
              {/* <button tabIndex={1} className="mintOne" disabled={this.props.loading} onClick={() => this.mint1()}><a>1</a></button>
                  <button tabIndex={2} className="mintTwo" disabled={this.props.loading} onClick={() => this.mint2()}>2</button> */}


              <button tabIndex={100} ref='#target1' id='target1' className="mintOne-public" disabled={this.props.loading} onClick={() => this.mint1()}><a>1</a></button>
              <button tabIndex={101} ref='#target2' id='target2' className="mintTwo-public" disabled={this.props.loading} onClick={() => this.mint2()}>2</button>
              <button tabIndex={102} ref='#target1' id='target3' className="mintThree-public" disabled={this.props.loading} onClick={() => this.mint3()}>3</button>
            </div>
            <button className="mintbutton" disabled={this.props.loading} onClick={() => this.mint()}>MINT {this.state.mintAmount} NINJAS</button>
          </>
          :
          //     null
          //   }
          // </>
          // :
          <div className="cannot-mint">
            {this.props.isWhitelistMintEnabled ? <>You are not included in the <strong>whitelist</strong>.</> : <>The contract is <strong>paused</strong>.</>}<br />
            Please come back during the next sale!
          </div>
        }
      </>
    );
  }
}
