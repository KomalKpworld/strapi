import React from "react";
import { List, ListItem, ListItemText, ListSubheader } from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const Sidebar = ({ onLogout }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Call the onLogout function passed from the parent component
    if (typeof onLogout === "function") {
      onLogout();
    }
  };
  return (
    <>
      <List>
        <ListSubheader>COLLECTION TYPES</ListSubheader>
        <ListItem
          onClick={() => navigate("/homepage")}
          button
          className="listItem"
        >
          <ListItemText>HomePage</ListItemText>
        </ListItem>
        <ListItem
          onClick={() => navigate("/category")}
          button
          className="listItem"
        >
          <ListItemText>Categories</ListItemText>
        </ListItem>
        <ListItem
          onClick={() => navigate("/subcategory")}
          button
          className="listItem"
        >
          <ListItemText>Sub-Categories</ListItemText>
        </ListItem>
        <ListItem
          onClick={() => navigate("/product")}
          button
          className="listItem"
        >
          <ListItemText>Product</ListItemText>
        </ListItem>
        <div style={{ height: "200px" }} />
        <ListItem onClick={handleLogout} button className="listItem">
          <ListItemText>Logout</ListItemText>
        </ListItem>
      </List>
    </>
  );
};

export default Sidebar;
