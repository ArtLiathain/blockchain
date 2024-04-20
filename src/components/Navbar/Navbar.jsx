import React from "react";
import { NavLink } from "react-router-dom";
import styled from "./Navbar.css"

const Navbar = () => {
  return (
    <div className="bg-gray-700">
      <nav className="flex justify-start gap-2 text-purple-400 ml-4 mr-4 text-2xl font-bold p-3">
        <NavLink
          to="/home"
          className={({ isActive }) =>
            isActive ? styled.active-link : styled.inactive-link
          }
        >
          Create Wallet
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? styled.active-link : styled.inactive-link
          }
        >
          Balance
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            isActive ? styled.active-link : styled.inactive-link
          }
        >
          Buy Tickets
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
