import React from "react";
import { Route, Routes } from "react-router-dom";

import "./App.css";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import Dashboard from "./Dashboard/Dashboard";
import SendOtp from "./components/sendotp";
import ResetPassword from "./components/resetpassword";
import ChangePassword from "./components/changepassword";


function App() {
  return (
    <>
    
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/sendotp" element={<SendOtp />} />
        <Route path="/resetpassword" element={<ResetPassword/>} />
        <Route path="/changepassword" element={<ChangePassword/>} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/Sign-Up" element={<SignUp />} />
      </Routes>
    </>
  );
}
export default App;
