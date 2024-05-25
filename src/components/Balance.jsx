import React, { useState } from "react";
import StyledForm from "./StyledForm/StyledForm";
import Web3 from "web3";


const balance = ()  => {
   const [address, setAddress] = useState("")
  const checkBalance = async (e) => {
    e.preventDefault();
    const web3 = new Web3("https://rpc2.sepolia.org");
    let value = await web3.eth.getBalance(address);
    value = Number(value)/(10**18)
    console.log(value);
  };

  return (
    <StyledForm submitFunction={checkBalance}>
      <label>Address</label>
      <input type="text" name="address" placeholder="Address" onChange={(e) => setAddress(e.target.value)}/>
      <button type="submit">Click me!</button>
    </StyledForm>
  );
};

export default balance;
