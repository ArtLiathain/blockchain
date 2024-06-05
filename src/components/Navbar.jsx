import React, { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css";
import Web3Context from "./Web3Context";
import Web3 from "web3";
import abi from "../assets/abi.json"

const Navbar = () => {
  const { walletAddress, tokenAddress, navbarRefresh } = useContext(Web3Context);
  const [walletValue, setWalletValue] = useState(0);
  const [tokenBalance, setTokenbalance] = useState(0);
  useEffect(() => {
    const web3 = new Web3("https://rpc2.sepolia.org");

    const fetchBalance = async () => {
      try {
        const balance = await web3.eth.getBalance(walletAddress);
        setWalletValue(
          Math.round(web3.utils.fromWei(balance, "ether") * 100) / 100
        );
        const contract = new web3.eth.Contract(abi, tokenAddress);
        setTokenbalance(await contract.methods.balanceOf(walletAddress).call())

      } catch (error) {
        console.log("No address provided yet");
        console.error(error)
        setWalletValue(0)
        setTokenbalance(0)
      }
    };
    fetchBalance();
  }, [walletAddress ,navbarRefresh]);


  return (
    <div className="bg-[#622121] flex items-center justify-between pr-3">
      <nav
        className={`${styles.navbarlink} flex justify-start gap-2 mx-4 text-2xl font-bold p-3`}
      >
        <NavLink
          to="/choosewallet"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.inactiveLink
          }
        >
          Choose Wallet
        </NavLink>
        <NavLink
          to="/buytickets"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.inactiveLink
          }
        >
          Tickets
        </NavLink>
        <NavLink
          to="/entry"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.inactiveLink
          }
        >
          Entry
        </NavLink>
      </nav>
      <div className="text-gray-200 font-bold text-xl">
        {(walletAddress != "" ? (walletAddress.slice(0, 15) + "...") : "")  +
          " Balance: " +
          walletValue +
          " SETH : " + tokenBalance + " Tickets"}
      </div>
    </div>
  );
};

export default Navbar;
