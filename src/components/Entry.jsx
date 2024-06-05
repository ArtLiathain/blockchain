import React, { useContext, useState } from "react";
import StyledForm from "./StyledForm/StyledForm";
import Web3Context from "./Web3Context";
import Web3 from "web3";
import abi from "../assets/abi.json";
import Modal from "./Modal";

const BurnTokens = () => {
  const { walletAddress, privateKey, tokenAddress, setnavbarRefresh } =
    useContext(Web3Context);
  const [openModal, setOpenModal] = useState(false);
  const [text, setText] = useState("");
  const [isError, setIsError] = useState(false);

  const Entry = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let amount = formData.get("amount");
    if (walletAddress === "" || privateKey === "" || amount === "") {
      setText(`Invalid Details Provided (Wallet or Amount)`);
      setIsError(true);
      setOpenModal(true);
    }

    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc2.sepolia.org")
    );
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
          .on("error", () => {
            setText("Error Proving Entry");
            setIsError(true);
            setOpenModal(true);
          });
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

  const checkBalance = async (e) => {
    e.preventDefault();
    const web3 = new Web3("https://rpc2.sepolia.org");
    if (walletAddress === "" || privateKey === "") {
      setText(`Invalid Wallet Details`);
      setIsError(true);
      setOpenModal(true);
      setnavbarRefresh(Math.random());
    }
    const contract = new web3.eth.Contract(abi, tokenAddress);
    const tokenBalance = await contract.methods.balanceOf(walletAddress).call();

    setText(
      ` Your new token balance is ${tokenBalance} if this is the same as your current please be patient as the blockchain is working`
    );
    setIsError(false);
    setOpenModal(true);
  };

  return (
    <>
      <div className="m-10 flex flex-col gap-5">
        <StyledForm submitFunction={Entry}>
          <h1 className="text-2xl text-center font-bold">Entry Tokens</h1>
          <label>Amount of tokens for entry</label>
          <input type="text" name="amount" placeholder="Amount of tokens" />
          <button
            className="mt-5 bg-blue-200 self-center p-4 rounded-lg text-black"
            type="submit"
          >
            Get Entry!
          </button>
        </StyledForm>
        <StyledForm submitFunction={checkBalance}>
          <h1 className="text-2xl text-center font-bold">
            Update Wallet Balance
          </h1>
          <button
            className="mt-5 bg-blue-200 self-center p-4 rounded-lg text-black"
            type="submit"
          >
            Wallet Balance
          </button>
        </StyledForm>
      </div>

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
