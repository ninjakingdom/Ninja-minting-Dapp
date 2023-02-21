import '../styles/global.css';
import ReactDOM from 'react-dom';
import Dapp from './react/Dapp';
import CollectionConfig from '../../../smart-contract/config/CollectionConfig';
import CountDown from './react/CountDown';

if (document.title === '') {
  document.title = CollectionConfig.tokenName;
}

document.addEventListener('DOMContentLoaded', async () => {
  ReactDOM.render(<>
    <CountDown />
    {/* <Dapp /> */}
  </>, document.getElementById('minting-dapp'));
});
