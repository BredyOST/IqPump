import { createAppKit } from '@reown/appkit/react';
import {EthersAdapter} from "@reown/appkit-adapter-ethers";
import { arbitrum, } from '@reown/appkit/networks'

const projectId = process.env.REACT_APP_APP_KIT_ID;

if (!projectId) {
  throw new Error('REACT_APP_APP_KIT_ID is not defined in the environment variables');
}

// 3. Create a metadata object
const metadata = {
  name: 'My Website',
  description: 'My Website description',
  url: 'https://mywebsite.com', // origin must match your domain & subdomain
  icons: ['https://avatars.mywebsite.com/'],
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
    <>

    </>
  )
}

export default App
