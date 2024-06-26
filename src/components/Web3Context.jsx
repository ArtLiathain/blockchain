import { useState } from 'react';
import { createContext } from 'react';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    // Create a state variable to hold the context value
    const [walletAddress, setwalletAddress] = useState('');
    const [privateKey, setprivateKey] = useState('');
    const [navbarRefresh, setnavbarRefresh] = useState(0);
    const tokenAddress = "0xD4fAA33E55D0161EaE5546cA0c9977EeB46eD6e8";
    return (
      <Web3Context.Provider value={{ walletAddress, setwalletAddress, privateKey, setprivateKey, tokenAddress, setnavbarRefresh, navbarRefresh }}>
        {children}
      </Web3Context.Provider>
    );
  };
export default Web3Context;