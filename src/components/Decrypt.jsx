import React from "react";
import StyledForm from "./StyledForm/StyledForm";
import Web3 from "web3";

const Decrypt = () => {
  const decryptWallet =  (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const web3 = new Web3();
    const walletStats = {
      keystore: formData.get("keystore"),
      password: formData.get("password"),
    };
    console.log(walletStats);
    var reader = new FileReader();

    reader.onload = async function  (e) {
      var keystore = e.target.result;
      try {
        // decrypt the wallet
        var wallet = await web3.eth.accounts.decrypt(keystore, walletStats.password);
        // display the wallet address
        console.log(wallet.address);
        // display the private key
        console.log(wallet.privateKey);
        // display the keystore
      } catch (error) {
        // show the modal with the error
        console.log("WHoops");
      }
    };

    reader.readAsText(walletStats.keystore);
  };

  return (
    <StyledForm submitFunction={decryptWallet}>
      <label>Password</label>
      <input type="text" name="password" placeholder="Password" />
      <label>Key Store</label>
      <input type="file" name="keystore" accept=".json" />
      <button type="submit">Submit</button>
    </StyledForm>
  );
};

export default Decrypt;
