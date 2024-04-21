import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import styles from"./App.module.css";
import Navbar from "./components/Navbar/Navbar";
import Homepage from "./components/Homepage/Homepage";
import CreateWallet from "./components/CreateWalletPage/CreateWallet";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className={`${styles.mainpage}`}>
      <BrowserRouter>
        <Navbar></Navbar>
        <Routes>
          <Route path="/createwallet" element={<CreateWallet></CreateWallet>}></Route>
          <Route path="/*" element={<Homepage></Homepage>}></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
