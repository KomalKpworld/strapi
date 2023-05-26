import React from "react";
import { Route, Routes } from "react-router-dom";
import { BrowserRouter } from "react-router-dom";

import {
  HomePage,
  Login,
  Category,
  SubCategory,
  Sidebar,
  Navbar,
  Product,
} from "./index";
import useStyles from "./styles";
import { CssBaseline } from "@mui/material";

const HomeApp = ({ onLogout }) => {
  const classes = useStyles();
  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <Navbar onLogout={onLogout} />
        <main className={classes.content}>
          <div className={classes.toolbar} />

          <Routes>
          <Route exact path="/homepage" element={<HomePage />}></Route>
            <Route exact path="/category" element={<Category />}></Route>
            <Route exact path="/subcategory" element={<SubCategory />}></Route>
            <Route exact path="/sidebar" element={<Sidebar onLogout={onLogout}/>}></Route>
            <Route exact path="/product" element={<Product />}></Route>
          </Routes>
        </main>
      </div>
    </>
  );
};

export default HomeApp;
