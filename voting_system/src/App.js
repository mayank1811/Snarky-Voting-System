import React from "react";
import { Route, Routes } from "react-router-dom";
import Generation from "./pages/Generation";
import Verification from "./pages/Verification";
import Home from "./pages/Home";
import Vote from "./pages/Vote";
import Admin from "./pages/Admin";
import Result from "./pages/Result";
import Party from "./pages/Party";
import "./App.css";

const App = () => {
  return (
    <div style={{ margin: "0 auto" }}>
      <Routes>
        <Route path='/' element={<Home />}></Route>
        <Route path='/getProof' element={<Generation />}></Route>
        <Route path='/verify' element={<Verification />}></Route>
        <Route path='/vote' element={<Vote />}></Route>
        <Route path='/admin' element={<Admin />}></Route>
        <Route path='/result' element={<Result />}></Route>
        <Route path='/party' element={<Party />}></Route>
      </Routes>
    </div>
  );
};

export default App;
