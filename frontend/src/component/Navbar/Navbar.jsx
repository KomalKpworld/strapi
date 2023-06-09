import React from "react";
import {
  AppBar,
  Toolbar,
  Drawer,
  Typography,
  Avatar,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

import useStyles from "./styles";
import Sidebar from "../Sidebar/Sidebar";

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  const classes = useStyles();
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));

  return (
    <main>
      <AppBar position="fixed">
        <Toolbar className={classes.toolbar}>
          <div>
            <Typography variant="h6" className={classes.title}>
              <b>Admin Panel</b>
            </Typography>
          </div>
          <div className={classes.profile}>
            <Button onClick={() => navigate("/profile")}>
              <Avatar
                style={{
                  border: "2px solid white",
                  backgroundColor: "rgb(3 17 48)",
                }}
              >
                {currentUser ? currentUser.username.charAt(0) : ""}
              </Avatar>
            </Button>
          </div>
        </Toolbar>
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
