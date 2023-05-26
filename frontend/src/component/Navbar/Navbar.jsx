import React from "react";
import { AppBar, Toolbar, Drawer } from "@mui/material";
import { Button } from "@mantine/core";

import useStyles from "./styles";
import Sidebar from "../Sidebar/Sidebar";

const Navbar = ({ onLogout }) => {
  const classes = useStyles();

  const handleLogout = () => {
    // Call the onLogout function passed from the parent component
    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  return (
    <>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>Admin Panel Project</Toolbar>
      </AppBar>
      <div>
        <nav className={classes.drawer}>
          <Drawer classes={{ paper: classes.drawerPaper }} variant="permanent">
            <Sidebar onLogout={onLogout} />
          </Drawer>
        </nav>
      </div>
    </>
  );
};

export default Navbar;
