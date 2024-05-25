import React from "react";
import StyledForm from "./StyledForm/StyledForm";
import abi from "../assets/abi.json";
import Web3 from "web3";

const BuyTickets = () => {
  const buyToken = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const transferData = {
      wallet: formData.get("Wallet"),
      privateKey: formData.get("pkey"),
      amount: formData.get("amount"),
    };
    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc2.sepolia.org")
    );
    console.log(typeof(transferData.privateKey))
    const tokenAddress = "0xE35556497e8b77d9d66E097C516960E444b91b85";
    let amount = parseInt(transferData.amount);
    console.log(transferData)
    const contract = new web3.eth.Contract(abi, tokenAddress);
    const tx = {
      from: transferData.wallet,
      to: tokenAddress,
      gas: 2000000,
      gasPrice: 122699482439,
      data: contract.methods.buyToken().encodeABI(),
      value: web3.utils.toWei(0.00001, 'ether'),
    };
    console.log(tx);
    const signedTx = await web3.eth.accounts.signTransaction(
      tx,
      transferData.privateKey
    );
    try {
      await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .on("receipt", console.log)
        .on("error", console.error);
    } catch (error) {
      console.error('An error occurred while sending the transaction:', error.toJSON());
    }

  };

  return (
    <StyledForm submitFunction={buyToken}>
      <label>Wallet</label>
      <input type="text" placeholder="Wallet Address" name="Wallet" />
      <label>Amount</label>
      <input type="text" name="amount" placeholder="Amount in Ether" />
      <label>Private Key</label>
      <input type="text" placeholder="Private Key" name="pkey" />
      <button type="submit">Press me</button>
    </StyledForm>
  );
};

export default BuyTickets;
