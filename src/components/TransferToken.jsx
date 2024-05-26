import React from "react";
import StyledForm from "./StyledForm/StyledForm";
import Web3 from "web3";
import abi from "../assets/abi.json";

const TransferFunds = () => {
  const transferToken = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc2.sepolia.org")
    );

    let tokenAddress = "0xb466831801aa5c481A0B069765d65b08121d01fe"; // HST contract address
    let fromAddress = formData.get("fromWallet"); // where to send it
    let toAddress = formData.get("toWallet"); // your wallet
    let privateKey = formData.get("privateKey");
    let amount = parseInt(formData.get("amount"));

    let contract = new web3.eth.Contract(abi, tokenAddress, {
      from: fromAddress,
    });

    console.log(fromAddress);

    web3.eth.getTransactionCount(fromAddress).then(async (count) => {
      let rawTransaction = {
        from: fromAddress,
        gasPrice: web3.utils.toHex(20 * 1e10),
        gasLimit: web3.utils.toHex(210000),
        to: tokenAddress,
        value: 0x0,
        data: contract.methods.transfer(toAddress, amount).encodeABI(),
        nonce: web3.utils.toHex(count),
      };
      let transaction = await web3.eth.accounts.signTransaction(
        rawTransaction,
        privateKey
      );
      web3.eth
        .sendSignedTransaction(transaction.rawTransaction)
        .on("transactionHash", (hash) => {
          console.log(`Transaction hash: ${hash}`);
        })
        .on("receipt", (receipt) => {
          console.log("Transaction receipt received:", receipt);
        });
    });
  };

  return (
    <>
      <StyledForm submitFunction={transferToken}>
        <label>Transfer From</label>
        <input type="text" name="fromWallet" placeholder="Transfer From" />
        <label>Transfer To</label>
        <input type="text" name="toWallet" placeholder="Transfer To" />
        <label>Amount</label>
        <input type="text" name="amount" placeholder="Amount" />
        <label>PrivateKey (To be removed)</label>
        <input type="text" name="privateKey" placeholder="PrivateKey" />
        <button>Submit</button>
      </StyledForm>
    </>
  );
};

export default TransferFunds;
