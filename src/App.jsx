import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import styles from "./App.module.css";
import Navbar from "./components/Navbar";
import ChooseWallet from "./components/ChooseWallet";
import Tickets from "./components/Tickets";
import {Web3Provider} from "./components/Web3Context";
import BurnTokens from "./components/Entry";


function App() {
  return (
    <div className={`${styles.mainpage}`}>
      <Web3Provider>
        <BrowserRouter>
          <Navbar></Navbar>
          <Routes>
            <Route path="/choosewallet" element={<ChooseWallet></ChooseWallet>}></Route>
            <Route path="/entry" element={<BurnTokens></BurnTokens>}></Route>
            <Route
              path="/buytickets"
              element={<Tickets></Tickets>}
            ></Route>
            <Route path="/*" element={<ChooseWallet></ChooseWallet>}></Route>
          </Routes>
        </BrowserRouter>
      </Web3Provider>
    </div>
  );
}

export default App;
