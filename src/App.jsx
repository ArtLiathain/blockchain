import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import styles from"./App.module.css";
import Navbar from "./components/Navbar";
import Homepage from "./components/Homepage";
import CreateWallet from "./components/CreateWallet";
import TransferFunds from "./components/TransferFunds";
import Decrypt from "./components/Decrypt";
import Balance from "./components/Balance";
import BuyTickets from "./components/BuyTickets";

function App() {

  return (
    <div className={`${styles.mainpage}`}>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/createwallet" element={<CreateWallet></CreateWallet>}></Route>
          <Route path="/transfer" element={<TransferFunds></TransferFunds>}></Route>
          <Route path="/decrypt" element={<Decrypt></Decrypt>}></Route>
          <Route path="/balance" element={<Balance></Balance>}></Route>
          <Route path="/buytickets" element={<BuyTickets></BuyTickets>}></Route>
          <Route path="/*" element={<Homepage></Homepage>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
