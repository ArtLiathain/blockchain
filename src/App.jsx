import { useState } from "react";
import { BrowserRouter } from "react-router-dom";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import Navbar from "./components/Navbar/Navbar";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="bg-black min-h-screen">
      <BrowserRouter>
        <Navbar></Navbar>
      </BrowserRouter>
    </div>
  );
}

export default App;
