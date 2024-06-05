import React, { useContext, useEffect, useState } from "react";
import StyledForm from "./StyledForm/StyledForm";
import abi from "../assets/abi.json";
import Web3 from "web3";
import Web3Context from "./Web3Context";
import Modal from "./Modal";

const Tickets = () => {
  const { walletAddress, privateKey, tokenAddress, setnavbarRefresh } =
    useContext(Web3Context);
  const [totalTickets, settotalTickets] = useState(0);
  const [percentageRemaining, setpercentageRemaining] = useState(0);
  const [gasPriceEstimate, setgasPriceEstimate] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [text, setText] = useState("");
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const web3 = new Web3("https://rpc2.sepolia.org");

    const fetchBalance = async () => {
      try {
        const contract = new web3.eth.Contract(abi, tokenAddress);
        settotalTickets(
          Number(await contract.methods.balanceOf(tokenAddress).call())
        );

        setpercentageRemaining(
          Math.round(
            (Number(await contract.methods.balanceOf(tokenAddress).call()) *
              100) /
              Number(await contract.methods.totalSupply().call())
          )
        );
        console.log("HI", percentageRemaining);
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
    if (
      walletAddress === "" ||
      privateKey === "" ||
      amount === "" ||
      toAddress === ""
    ) {
      setText(`Invalid Details Provided (Wallet or Amount)`);
      setIsError(true);
      setOpenModal(true);
    }

    let contract = new web3.eth.Contract(abi, tokenAddress, {
      from: walletAddress,
    });

    web3.eth.getTransactionCount(walletAddress).then(async (count) => {
      let rawTransaction = {
        from: walletAddress,
        gasPrice: web3.utils.toHex(
          Math.round(gasPriceEstimate * 1.1 * 10 ** 18)
        ),
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
      try {
        await web3.eth
          .sendSignedTransaction(transaction.rawTransaction)
          .on("transactionHash", (hash) => {
            console.log(`Transaction hash: ${hash}`);
            setText(`Transferred ${amount} Tokens to ${toAddress}`);
            setIsError(false);
            setOpenModal(true);
          })
          .on("receipt", console.log)
          .on("error", () => {
            setText("Error transferring tokens");
            setIsError(true);
            setOpenModal(true);
          });
      } catch (error) {
        console.error(
          "An error occurred while sending the transaction:",
          error.toJSON()
        );
      }
      await new Promise((r) => setTimeout(r, 7000));
      setnavbarRefresh(Math.random());
    });
  };
  const buyToken = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    let amount = parseInt(formData.get("amount"));
    if (walletAddress === "" || privateKey === "" || amount === "") {
      setText(`Invalid Details Provided (Wallet or Amount)`);
      setIsError(true);
      setOpenModal(true);
    }

    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc2.sepolia.org")
    );
    const contract = new web3.eth.Contract(abi, tokenAddress);
    const tokenValue = await contract.methods.tokenCost().call();
    console.log(gasPriceEstimate);
    const tx = {
      from: walletAddress,
      to: tokenAddress,
      gas: web3.utils.toHex(200000),
      gasPrice: web3.utils.toHex(Math.round(gasPriceEstimate * 1.1 * 10 ** 18)),
      data: contract.methods.buyToken().encodeABI(),
      value: amount * Number(tokenValue),
    };
    console.log(tx);
    const signedTx = await web3.eth.accounts.signTransaction(tx, privateKey);
    try {
      await web3.eth
        .sendSignedTransaction(signedTx.rawTransaction)
        .on("transactionHash", (hash) => {
          console.log(`Transaction hash: ${hash}`);
          setText(`Bought ${amount} Tokens`);
          setIsError(false);
          setOpenModal(true);
        })
        .on("receipt", console.log)
        .on("error", () => {
          setText("Error buying tokens");
          setIsError(true);
          setOpenModal(true);
        });
    } catch (error) {
      console.error(
        "An error occurred while sending the transaction:",
        error.toJSON()
      );
    }
    await new Promise((r) => setTimeout(r, 7000));
    setnavbarRefresh(Math.random());
  };

  const RefundWallet = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const web3 = new Web3(
      new Web3.providers.HttpProvider("https://rpc2.sepolia.org")
    );
    let amount = formData.get("amount");
    if (walletAddress === "" || privateKey === "" || amount === "") {
      setText(`Invalid Details Provided (Wallet or Amount)`);
      setIsError(true);
      setOpenModal(true);
    }
    let contract = new web3.eth.Contract(abi, tokenAddress, {
      from: walletAddress,
    });

    web3.eth.getTransactionCount(walletAddress).then(async (count) => {
      let rawTransaction = {
        from: walletAddress,
        to: tokenAddress,
        gasPrice: web3.utils.toHex(await web3.eth.getGasPrice()),
        gasLimit: web3.utils.toHex(150000),
        data: contract.methods.refundToken(amount).encodeABI(),
        nonce: web3.utils.toHex(count),
      };
      let transaction = await web3.eth.accounts.signTransaction(
        rawTransaction,
        privateKey
      );
      try {
        await web3.eth
          .sendSignedTransaction(transaction.rawTransaction)
          .on("transactionHash", (hash) => {
            console.log(`Transaction hash: ${hash}`);
            setText(`Refunded ${amount} Tokens!`);
            setIsError(false);
            setOpenModal(true);
          })
          .on("receipt", console.log)
          .on("error", () => {
            setText("Error refunding tokens");
            setIsError(true);
            setOpenModal(true);
          });
      } catch (error) {
        console.error(
          "An error occurred while sending the transaction:",
          error.toJSON()
        );
      }
      await new Promise((r) => setTimeout(r, 7000));
      setnavbarRefresh(Math.random());
    });
  };

  return (
    <div className="flex flex-col m-10 gap-5">
      <StyledForm submitFunction={buyToken}>
        <h1 className="text-2xl text-center font-bold">Buy Tickets</h1>
        <h1 className="text-2xl font-bold">
          Remaining Concert Tickets: {totalTickets +  " - " + percentageRemaining}% 
        </h1>
        <label>Amount</label>
        <input type="text" name="amount" placeholder="Amount in Ether" />
        <h1>{`${Number(gasPriceEstimate) * 200000} ETH gas`}</h1>
        <button
          className="mt-5 bg-blue-200 self-center p-4 rounded-lg text-black"
          type="submit"
        >
          Buy Tickets
        </button>
      </StyledForm>
      <StyledForm submitFunction={transferToken}>
        <h1 className="text-2xl text-center font-bold">Transfer Tickets</h1>

        <label>Transfer To</label>
        <input type="text" name="toWallet" placeholder="Transfer To" />
        <label>Amount</label>
        <input type="text" name="amount" placeholder="Amount" />
        <h1>{`${Number(gasPriceEstimate) * 200000} ETH gas`}</h1>
        <button
          className="mt-5 bg-blue-200 self-center p-4 rounded-lg text-black"
          type="submit"
        >
          Transfer Tokens
        </button>
      </StyledForm>
      <StyledForm submitFunction={RefundWallet}>
        <h1 className="text-2xl text-center font-bold">Refund Tokens</h1>
        <label>Amount of tokens for refund</label>
        <input type="text" name="amount" placeholder="Amount of tokens" />
        <h1>{`${Number(gasPriceEstimate) * 150000} ETH gas`}</h1>
        <button
          className="mt-5 bg-blue-200 self-center p-4 rounded-lg text-black"
          type="submit"
        >
          Refund Tickets
        </button>
      </StyledForm>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
        messageToDisplay={text}
        error={isError}
      ></Modal>
    </div>
  );
};

export default Tickets;
