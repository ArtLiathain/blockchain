import React from "react";
import { NavLink } from "react-router-dom";
import styles from "./Navbar.module.css"

const Navbar = () => {
  return (
    <div className="bg-gray-700">
      <nav className={`${styles.navbarlink} flex justify-start gap-2 mx-4 text-2xl font-bold p-3`}>
        <NavLink
          to="/createwallet"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.inactiveLink
          }
        >
          Create Wallet
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.inactiveLink
          }
        >
          Balance
        </NavLink>
        <NavLink
          to="/signup"
          className={({ isActive }) =>
            isActive ? styles.activeLink : styles.inactiveLink
          }
        >
          Buy Tickets
        </NavLink>
      </nav>
    </div>
  );
};

export default Navbar;
