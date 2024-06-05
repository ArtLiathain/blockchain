import React, { useContext, useEffect, useState } from "react";
import StyledForm from "./StyledForm/StyledForm";
import abi from "../assets/abi.json";
import Web3 from "web3";
import Web3Context from "./Web3Context";

const BuyTickets = () => {
  const {
    walletAddress,
    privateKey,
    tokenAddress,
    setnavbarRefresh,
    navbarRefresh,
  } = useContext(Web3Context);
  const [totalTickets, settotalTickets] = useState(0);
  const [gasPriceEstimate, setgasPriceEstimate] = useState(0);
  useEffect(() => {
    const web3 = new Web3("https://rpc2.sepolia.org");

    const fetchBalance = async () => {
      try {
        const contract = new web3.eth.Contract(abi, tokenAddress);
        settotalTickets(
          Number(await contract.methods.balanceOf(tokenAddress).call())
        );
        setgasPriceEstimate(
          web3.utils.fromWei(await web3.eth.getGasPrice(), "ether")
        );
      } catch (error) {
        console.log("No address provided yet");
        console.error(error);
        settotalTickets(0);
      }
    };
    fetchBalance();
  }, []);

  const transferToken = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc2.sepolia.org")
    );

    let toAddress = formData.get("toWallet"); // your wallet
    let amount = parseInt(formData.get("amount"));

    let contract = new web3.eth.Contract(abi, tokenAddress, {
      from: walletAddress,
    });

    web3.eth.getTransactionCount(walletAddress).then(async (count) => {
      let rawTransaction = {
        from: walletAddress,
        gasPrice: web3.utils.toHex(Math.round(gasPriceEstimate * 1.1 * 10**18)),
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
          setnavbarRefresh(Math.random());
        })
        .on("receipt", (receipt) => {
          console.log("Transaction receipt received:", receipt);
        });
    });
  };
  const buyToken = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if (walletAddress === "" || privateKey === "") {
      setText(`Invalid Wallet Details`);
      setIsError(true);
      setOpenModal(true);
    }

    const transferData = {
      amount: formData.get("amount"),
    };
    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc2.sepolia.org")
    );
    let amount = parseInt(transferData.amount);
    const contract = new web3.eth.Contract(abi, tokenAddress);
    const tokenValue = await contract.methods.tokenCost().call();
    console.log(gasPriceEstimate)
    const tx = {
      from: walletAddress,
      to: tokenAddress,
      gas: web3.utils.toHex(200000),
      gasPrice: web3.utils.toHex(Math.round(gasPriceEstimate * 1.1 * 10**18)),
      data: contract.methods.buyToken().encodeABI(),
      value: amount * Number(tokenValue),
    };
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    try {
      await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .on("transactionHash", (hash) => {
          console.log(`Transaction hash: ${hash}`);
          setnavbarRefresh(Math.random());
        })
        .on("receipt", console.log)
        .on("error", console.error);
    } catch (error) {
      console.error(
        "An error occurred while sending the transaction:",
        error.toJSON()
      );
    }
  };

  return (
    <>
      <h1>{totalTickets}</h1>

      <StyledForm submitFunction={buyToken}>
        <h1>{`${Number(gasPriceEstimate) * 200000} ETH roughly for gas`}</h1>
        <label>Amount</label>
        <input type="text" name="amount" placeholder="Amount in Ether" />
        <button type="submit">Press me</button>
      </StyledForm>
      <StyledForm submitFunction={transferToken}>
        <h1>{`${Number(gasPriceEstimate) * 200000} ETH roughly for gas`}</h1>

        <label>Transfer To</label>
        <input type="text" name="toWallet" placeholder="Transfer To" />
        <label>Amount</label>
        <input type="text" name="amount" placeholder="Amount" />
        <button type="submit">Press me</button>
      </StyledForm>
    </>
  );
};

export default BuyTickets;
