import React, { useContext } from "react";
import StyledForm from "./StyledForm/StyledForm";
import Web3 from "web3";
import Web3Context from "./Web3Context";

const ChooseWallet = () => {
  const { setwalletAddress, setprivateKey } = useContext(Web3Context);

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
        // decrypt the wallet
        var wallet = await web3.eth.accounts.decrypt(
          keystore,
          walletStats.password
        );
        // display the wallet address
        console.log(wallet.address);
        setwalletAddress(wallet.address);
        // display the private key
        console.log(wallet.privateKey);
        setprivateKey(wallet.privateKey);
        // display the keystore
      } catch (error) {
        // show the modal with the error
        console.error(error);
      }
    };

    reader.readAsText(walletStats.keystore);
  };

  const setWalletValues = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setwalletAddress(formData.get("Address"));
    setprivateKey(formData.get("privateKey"));
  };

  return (
    <div className="flex flex-col gap-2">
      <StyledForm submitFunction={decryptWallet}>
        <label>Password</label>
        <input type="text" name="password" placeholder="Password" />
        <label>Key Store</label>
        <input type="file" name="keystore" accept=".json" />
        <button type="submit">Submit</button>
      </StyledForm>

      <StyledForm submitFunction={setWalletValues}>
        <label>Address</label>
        <input type="text" name="Address" placeholder="Address" />
        <label>Private Key</label>
        <input type="text" name="privateKey" placeholder="Private Key" />
        <button type="submit">Submit</button>
      </StyledForm>
    </div>
  );
};

export default ChooseWallet;
