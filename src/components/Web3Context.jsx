import { useState } from 'react';
import { createContext } from 'react';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    // Create a state variable to hold the context value
    const [walletAddress, setwalletAddress] = useState('');
    const [privateKey, setprivateKey] = useState('');
    const [navbarRefresh, setnavbarRefresh] = useState(0);
    const tokenAddress = "0x49801377B813Bc3123a396361F915F60B827b5f8";
    return (
      <Web3Context.Provider value={{ walletAddress, setwalletAddress, privateKey, setprivateKey, tokenAddress, setnavbarRefresh, navbarRefresh }}>
        {children}
      </Web3Context.Provider>
    );
  };
export default Web3Context;