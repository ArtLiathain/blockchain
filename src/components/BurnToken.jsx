import React, { useContext, useState } from "react";
import StyledForm from "./StyledForm/StyledForm";
import Web3Context from "./Web3Context";
import Web3 from "web3";
import abi from "../assets/abi.json";
import Modal from "./ErrorModel";

const BurnTokens = () => {
  const { walletAddress, privateKey, tokenAddress, setnavbarRefresh } =
    useContext(Web3Context);
  const [openModal, setOpenModal] = useState(false);
  const [text, setText] = useState("");
  const [isError, setIsError] = useState(false);


  const burnTokens = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    if(walletAddress === "" || privateKey === ""){
        setText(
            `Invalid Wallet Details`
          );
          setIsError(true);
          setOpenModal(true);
    }

    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc2.sepolia.org")
    );
    let amount = formData.get("amount");
    let contract = new web3.eth.Contract(abi, tokenAddress, {
      from: walletAddress,
    });

    web3.eth.getTransactionCount(walletAddress).then(async (count) => {
      let rawTransaction = {
        from: walletAddress,
        to: tokenAddress,
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
        gasLimit: web3.utils.toHex(150000),
        data: contract.methods.burn(amount).encodeABI(),
        nonce: web3.utils.toHex(count),
      };
      let transaction = await web3.eth.accounts.signTransaction(
        rawTransaction,
        privateKey
      );
      const initalbalance = await contract.methods
        .balanceOf(walletAddress)
        .call();
      try {
        await web3.eth
          .sendSignedTransaction(transaction.rawTransaction)
          .on("transactionHash", (hash) => {
            console.log(`Transaction hash: ${hash}`);
            setText(
              `Entry allowed for ${amount} people.\n Token balance from ${Number(
                initalbalance
              )} to ${Number(initalbalance) - amount}`
            );
            setIsError(false);
            setOpenModal(true);
          })
          .on("receipt", console.log)
          .on("error", console.error);
      } catch (error) {
        console.error(
          "An error occurred while sending the transaction:",
          error
        );
      }
      await new Promise((r) => setTimeout(r, 7000));
      setnavbarRefresh(Math.random());
    });
  };

  return (
    <>
      <StyledForm submitFunction={burnTokens}>
        <label>Amount of tokens for entry</label>
        <input type="text" name="amount" placeholder="Amount of tokens" />
        <button type="submit">Click me!</button>
      </StyledForm>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        messageToDisplay={text}
        error={isError}
      ></Modal>
    </>
  );
};

export default BurnTokens;
