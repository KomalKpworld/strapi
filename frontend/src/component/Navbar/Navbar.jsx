import React from "react";
import { AppBar, Toolbar, Drawer } from "@mui/material";

import useStyles from "./styles";
import Sidebar from "../Sidebar/Sidebar";

const Navbar = ({ onLogout }) => {
  const classes = useStyles();

  return (
    <main>
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
    </main>
  );
};

export default Navbar;
