import {createAppKit } from '@reown/appkit/react';
import {EthersAdapter} from "@reown/appkit-adapter-ethers";
import { arbitrum, } from '@reown/appkit/networks'
import { ToastContainer } from 'react-toastify';

import MainIqPumpWindow from "./features/main-iq-pump-window/main-iq-pump-window.tsx";

const projectId = import.meta.env.VITE_APP_APP_KIT_ID;
export const FUNDING_WALLET_IQ_PUMP = import.meta.env.VITE_APP_FUNDING_WALLET_ERC;

console.log(projectId)
if (!projectId) {
  throw new Error('REACT_APP_APP_KIT_ID is not defined in the environment variables');
}

// 3. Create a metadata object
const metadata = {
  name: 'iq Pump',
  description: 'iq pump',
  url: 'https://',
  icons: ['https://'],
};

// 4. Create a AppKit instance
createAppKit({
  adapters: [new EthersAdapter()],
  networks: [arbitrum],
  metadata,
  projectId,
  features: {
    analytics: true, // Optional - defaults to your Cloud configuration
    email: false, // default to true
    socials: false,
    swaps: false, // Optional - true by default
    send: false,
    onramp: false, // убрать buy cripto
  },
});


function App() {

  return (
      <div>
            <MainIqPumpWindow />
            <ToastContainer />
      </div>
  )
}

export default App
