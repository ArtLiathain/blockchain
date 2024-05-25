import React from "react";
import StyledForm from "./StyledForm/StyledForm";
import Web3 from "web3";
import abi from "../assets/abi.json";

const TransferFunds = () => {
  const transferStuff = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const transferData = {
      fromWallet: formData.get("fromWallet"),
      toWallet: formData.get("toWallet"),
      amount: formData.get("amount"),
      privateKey: formData.get("privateKey"),
    };
    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc2.sepolia.org")
    );

    let tokenAddress = "0xb466831801aa5c481A0B069765d65b08121d01fe"; // HST contract address
    let toAddress = transferData.fromWallet; // where to send it
    let fromAddress = transferData.toWallet; // your wallet
    let privateKey = transferData.privateKey;
    let amount = parseInt(transferData.amount);

    let contract = new web3.eth.Contract(abi, tokenAddress, {
      from: fromAddress,
    });

    try {
      const gasPrice = await web3.eth.getGasPrice();
      console.log(
        "Current price:",
        web3.utils.fromWei(Number(gasPrice)*210000/(10**18), "gwei"),
        "Gwei"
      );
      // You may want to convert gasPrice from Wei to Gwei or other units for better readability
    } catch (error) {
      console.error("Error fetching gas price:", error);
    }
    // 1e18 === 1 HST
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
        .on("transactionHash", console.log)
        .on("error", console.error);
    });
  };

  return (
    <>
      <StyledForm submitFunction={transferStuff}>
        <label>Transfer To</label>
        <input type="text" name="toWallet" placeholder="Transfer To" />
        <label>Transfer From</label>
        <input type="text" name="fromWallet" placeholder="Transfer From" />
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
