import React, { useContext, useState } from "react";
import StyledForm from "./StyledForm/StyledForm";
import Web3 from "web3";
import Web3Context from "./Web3Context";
import Modal from "./Modal";

const ChooseWallet = () => {
  const { walletAddress, setwalletAddress, privateKey, setprivateKey } =
    useContext(Web3Context);
  const [openModal, setOpenModal] = useState(false);
  const [modalError, setError] = useState("");
  const [password, setPassword] = useState("");

  const decryptWallet = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const web3 = new Web3();
    const walletStats = {
      keystore: formData.get("keystore"),
      password: formData.get("password"),
    };
    var reader = new FileReader();
    reader.onload = async function (e) {
      var keystore = e.target.result;
      try {
        var wallet = await web3.eth.accounts.decrypt(
          keystore,
          walletStats.password
        );
        setwalletAddress(wallet.address);
        setprivateKey(wallet.privateKey);
      } catch (error) {
        console.error(error);
        setOpenModal(true);
        setError("Incorrect Wallet Details");
      }
    };
    reader.readAsText(walletStats.keystore);
  };

  const createWallet = async (e) => {
    e.preventDefault();
    let web3 = new Web3();
    const formData = new FormData(e.target);
    if (formData.get("password") == "") {
      setError("No password provided");
      setOpenModal(true);
      return;
    }
    let wallet = web3.eth.accounts.create();
    setwalletAddress(wallet.address);
    setprivateKey(wallet.privateKey.toString());
    setPassword(formData.get("password"));
  };

  const saveAs = (blob, filename) => {
    var url = URL.createObjectURL(blob);
    var a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
  };
  const downloadFile = async () => {
    let web3 = new Web3();
    console.log(privateKey);
    if (privateKey === "" || walletAddress === "") {
      setError("No wallet selected");
      setOpenModal(true);
      return;
    }
    if (password === "") {
      setError("No password provided");
      setOpenModal(true);
      return;
    }
    let keystore = await web3.eth.accounts.encrypt(privateKey, password);
    var blob = new Blob([JSON.stringify(keystore)], {
      type: "text/plain;charset=utf-8",
    });
    saveAs(blob, walletAddress + ".json");
  };

  const setWalletValues = async (e) => {
    e.preventDefault();
    const web3 = new Web3();

    const formData = new FormData(e.target);
    const valid = await web3.utils.isAddress(formData.get("Address"));
    if (valid) {
      setwalletAddress(formData.get("Address"));
      console.log(walletAddress);
      setprivateKey(formData.get("privateKey"));
      console.log(privateKey);
      setPassword(formData.get("password"));
    } else {
      setOpenModal(true);
      setError("Incorrect wallet details");
    }
  };
  console.log(openModal);

  return (
    <div className="grid grid-cols-2 min-h-screen">
      <div className="ml-10 flex flex-col gap-5 mt-10">
        <StyledForm submitFunction={decryptWallet}>
          <h1 className="text-black font-bold self-center text-2xl">
            Wallet from Keystore
          </h1>
          <label>Password</label>
          <input type="text" name="password" placeholder="Password" />
          <label>Key Store</label>
          <input type="file" name="keystore" accept=".json" />
          <button
            className="mt-5 bg-blue-200 self-center p-4 rounded-lg text-black"
            type="submit"
          >
            Submit Wallet
          </button>
        </StyledForm>
        <StyledForm submitFunction={setWalletValues}>
          <h1 className="text-black font-bold self-center text-2xl">
            Wallet from Private Key
          </h1>
          <label>Address in Hex</label>
          <input type="text" name="Address" placeholder="Address" />
          <label>Private Key in Hex</label>
          <input type="text" name="privateKey" placeholder="Private Key" />
          <label>Password (Optional, for keystore)</label>
          <input type="text" name="password" placeholder="Password" />
          <button
            className="mt-5 bg-blue-200 self-center p-4 rounded-lg text-black"
            type="submit"
          >
            Submit Wallet
          </button>
        </StyledForm>
        <StyledForm submitFunction={createWallet}>
          <div className="text-black text-2xl font-bold text-center">
            Create Wallet
          </div>
          <label>Password</label>
          <input type="text" name="password" placeholder="Password" />
          <button
            className="mt-5 bg-blue-200 self-center p-4 rounded-lg text-black"
            type="submit"
          >
            Create Wallet
          </button>
        </StyledForm>
      </div>
      <div className="flex flex-col items-center text-center mt-10">
        <div className="text-black text-2xl font-bold">
          Wallet Selected is {walletAddress != "" ? walletAddress : "None"}
        </div>

        <div className="flex flex-col w-3/4 justify-center items-start gap-10">
          <div className="h-1/4 w-full">
            <label className="text-black">Wallet Address</label>
            <div className="bg-white w-full p-3 rounded-md">
              {walletAddress}
            </div>
          </div>
          <div className="h-1/4 w-full flex flex-col items-stretch">
            <label className="text-black">Private Key</label>
            <div className="bg-white w-full p-3 rounded-md break-all">
              {privateKey}
            </div>
          </div>
          <button
            onClick={downloadFile}
            className="mt-5 bg-blue-200 self-center p-4 rounded-lg text-black"
          >
            Download Keystore
          </button>
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        messageToDisplay={modalError}
        error={true}
      />
    </div>
  );
};

export default ChooseWallet;
