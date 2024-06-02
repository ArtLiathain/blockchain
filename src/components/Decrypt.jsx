import React, { useContext, useState } from "react";
import StyledForm from "./StyledForm/StyledForm";
import Web3 from "web3";
import Web3Context from "./Web3Context";
import Modal from "./ErrorModel";

const ChooseWallet = () => {
  const { walletAddress, setwalletAddress, privateKey, setprivateKey } =
    useContext(Web3Context);
  const [openModal, setOpenModal] = useState(false);
  const [modalError, setError] = useState("");

  const decryptWallet = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const web3 = new Web3();
    const walletStats = {
      keystore: formData.get("keystore"),
      password: formData.get("password"),
    };
    console.log(walletStats);
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

  const setWalletValues = async (e) => {
    e.preventDefault();
    const web3 = new Web3();

    const formData = new FormData(e.target);
    const valid = await web3.utils.isAddress(formData.get("Address"));
    if (valid) {
      setwalletAddress(formData.get("Address"));
      setprivateKey(formData.get("privateKey"));
    }
  };
  console.log(openModal);

  return (
    <div className="grid grid-cols-2 min-h-screen">
      <div className="flex flex-col gap-5 mt-10">
        <StyledForm submitFunction={decryptWallet}>
          <h1 className="text-white font-bold self-center text-2xl">
            Wallet from Keystore
          </h1>
          <label>Password</label>
          <input type="text" name="password" placeholder="Password" />
          <label>Key Store</label>
          <input type="file" name="keystore" accept=".json" />
          <button type="submit">Submit</button>
        </StyledForm>

        <StyledForm submitFunction={setWalletValues}>
          <h1 className="text-white font-bold self-center text-2xl">
            Wallet from Private Key
          </h1>

          <label>Address</label>
          <input type="text" name="Address" placeholder="Address" />
          <label>Private Key</label>
          <input type="text" name="privateKey" placeholder="Private Key" />
          <button type="submit">Submit</button>
        </StyledForm>
      </div>
      <div className="flex flex-col items-center text-center mt-10">
        <div className="text-white text-2xl">
          Wallet Selected is {walletAddress != "" ? walletAddress : "None"}
        </div>

        <div className="flex flex-col w-3/4 justify-center items-start gap-10">
          <div className="h-1/4 w-full">
            <label className="text-white">Wallet Address</label>
            <div className="bg-white w-full p-3 rounded-md">
              {walletAddress}
            </div>
          </div>
          <div className="h-1/4 w-full flex flex-col items-stretch">
            <label className="text-white">Private Key</label>
            <div className="bg-green-300 w-full p-3 rounded-md break-all">
              {privateKey}
            </div>
          </div>
        </div>
      </div>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        errorToDisplay={modalError}
      />
    </div>
  );
};

export default ChooseWallet;
