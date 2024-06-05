import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import Navbar from "./components/Navbar";
import CreateWallet from "./components/CreateWallet";
import TransferFunds from "./components/TransferToken";
import ChooseWallet from "./components/Decrypt";
import Balance from "./components/Balance";
import BuyTickets from "./components/BuyTickets";
import {Web3Provider} from "./components/Web3Context";
import BurnTokens from "./components/BurnToken";
import Refund from "./components/Refund";


function App() {
  return (
    <div className={`${styles.mainpage}`}>
      <Web3Provider>
        <BrowserRouter>
          <Navbar></Navbar>
          <Routes>
            <Route
              path="/transfer"
              element={<TransferFunds></TransferFunds>}
            ></Route>
            <Route path="/choosewallet" element={<ChooseWallet></ChooseWallet>}></Route>
            <Route path="/balance" element={<Balance></Balance>}></Route>
            <Route path="/entry" element={<BurnTokens></BurnTokens>}></Route>
            <Route path="/refund" element={<Refund></Refund>}></Route>
            <Route
              path="/buytickets"
              element={<BuyTickets></BuyTickets>}
            ></Route>
            <Route path="/*" element={<ChooseWallet></ChooseWallet>}></Route>
          </Routes>
        </BrowserRouter>
      </Web3Provider>
    </div>
  );
}

export default App;
