import React, { useState } from "react";
import Web3 from "web3";
import StyledForm from "./StyledForm/StyledForm";
import abi from "../assets/abi.json";

const CreateWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [keystore, setKeystore] = useState("");
  const createWallet = async (e) => {
    e.preventDefault();
    let web3 = new Web3();
    const formData = new FormData(e.target);
    let wallet = web3.eth.accounts.create();
    let keystore = await web3.eth.accounts.encrypt(
      wallet.privateKey,
      formData.get("password")
    );
    setPrivateKey(wallet.address);
    setWalletAddress(wallet.privateKey);
    setKeystore(keystore);
  };

  const saveAs = (blob, filename) => {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };

  const downloadFile = () => {
    if (keystore == "") {
      return;
    }
    console.log(keystore)
    var blob = new Blob([JSON.stringify(keystore)], { type: "text/plain;charset=utf-8" });
    saveAs(blob, walletAddress + ".json");
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
          <button onClick={downloadFile}>Download Keystore</button>
        </div>
        <div className="flex flex-col justify-center gap-16 mr-16 items-start">
          <div className="bg-white h-1/6 w-full">{walletAddress}</div>
          <div className="bg-green-300 h-1/6 w-full">{privateKey}</div>
        </div>
      </div>
    </>
  );
};

export default CreateWallet;
