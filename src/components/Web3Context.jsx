import { useState } from 'react';
import { createContext } from 'react';

const Web3Context = createContext();

export const Web3Provider = ({ children }) => {
    // Create a state variable to hold the context value
    const [walletAddress, setwalletAddress] = useState('');
    const [privateKey, setprivateKey] = useState('');
  
    return (
      <Web3Context.Provider value={{ walletAddress, setwalletAddress, privateKey, setprivateKey }}>
        {children}
      </Web3Context.Provider>
    );
  };
export default Web3Context;