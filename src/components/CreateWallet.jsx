import React, { useState } from "react";
import Web3 from "web3";
import StyledForm from "./StyledForm/StyledForm";
import abi from "../assets/abi.json";

const CreateWallet = () => {
  const [topText, changeTopText] = useState("");
  const [bottomText, changeBottomText] = useState("");
  const createWallet = async (e) => {
    e.preventDefault();
    let web3 = new Web3();
    let wallet = web3.eth.accounts.create();
    let keystore = await web3.eth.accounts.encrypt(wallet.privateKey, "1234");
    changeBottomText(keystore.address);
    changeTopText(wallet.privateKey);
    console.log(keystore);
    let temp = await web3.eth.accounts.decrypt(keystore, "1234");
    console.log(temp);
  };

  return (
    <>
      <div className="grid grid-cols-2 min-h-screen">
        <div className="flex flex-col items-center justify-center">
          <StyledForm submitFunction={createWallet}>
            <div className="text-xl mb-5">Create Wallet</div>
            <label>Password</label>
            <input type="text" name="password" placeholder="Password" />
            <button type="submit">Create Wallet</button>
          </StyledForm>
        </div>
        <div className="flex flex-col justify-center gap-16 mr-16 items-start">
          <div className="bg-white h-1/6 w-full">{topText}</div>
          <div className="bg-green-300 h-1/6 w-full">{bottomText}</div>
        </div>
      </div>
    </>
  );
};

export default CreateWallet;
