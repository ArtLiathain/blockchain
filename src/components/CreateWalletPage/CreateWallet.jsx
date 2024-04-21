import React from 'react';
import Web3 from 'web3';


const CreateWallet = () => {
     const createWallet = async () => {
        let web3 = new Web3();
        let wallet = web3.eth.accounts.create();
        let keystore =  await web3.eth.accounts.encrypt(wallet.privateKey, "1234"); 
        console.log(keystore)
        let temp =await web3.eth.accounts.decrypt(keystore, "1234");
        console.log(temp)
    }

    return (
        <div>
            <button onClick={(createWallet)}>Create WAllet</button>
        </div>
    );
};

export default CreateWallet;