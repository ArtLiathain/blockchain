import React, { useState } from "react";
import Web3 from "web3";
import StyledForm from "./StyledForm/StyledForm";
import cWallet from "../assets/cryptoWallet.webp";
import Modal from "./ErrorModel";

const CreateWallet = () => {
  const [walletAddress, setWalletAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [keystore, setKeystore] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const createWallet = async (e) => {
    e.preventDefault();
    let web3 = new Web3();
    const formData = new FormData(e.target);
    if (formData.get("password") == "") {
      setOpenModal(true);
      return;
    }
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
    console.log(keystore);
    var blob = new Blob([JSON.stringify(keystore)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, walletAddress + ".json");
  };

  return (
    <>
      <div className="grid grid-cols-2 min-h-screen">
        <div className="flex flex-col items-stretch justify-start mt-10">
          <StyledForm submitFunction={createWallet}>
            <div className="text-black text-2xl font-bold text-center">
              Create Wallet
            </div>
            <label>Password</label>
            <input type="text" name="password" placeholder="Password" />
            <button type="submit">Create Wallet</button>
          </StyledForm>
        </div>
        <div className="flex flex-col justify-start items-center text-center mt-10">
          <div className="flex flex-col w-3/4 justify-center items-start gap-10">
            <div className="h-1/4 w-full">
              <label className="text-black">Wallet Address</label>
              <div className="bg-white w-full p-3 rounded-md">
                {walletAddress}
              </div>
            </div>
            <div className="h-1/4 w-full flex flex-col items-stretch">
              <label className="text-black">Private Key</label>
              <div className="bg-green-300 w-full p-3 rounded-md break-all">
                {privateKey}
              </div>
            </div>
          </div>
          <button
            onClick={downloadFile}
            className="mt-5 bg-gray-500 self-center p-4 rounded-lg text-black"
          >
            Download Keystore
          </button>
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        errorToDisplay={"No password provided"}
      ></Modal>
    </>
  );
};

export default CreateWallet;
