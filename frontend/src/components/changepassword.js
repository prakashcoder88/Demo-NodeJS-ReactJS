import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import { useNavigate } from "react-router-dom";

import api from "./api.js";

function ChangePassword() {
    const Nevigate = useNavigate();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChange = (e) => {
    const { value, name } = e.target;
    if (name === "oldPassword") {
      setOldPassword(value);
    } else if (name === "newPassword") {
      setNewPassword(value);
    } else if (name === "confirmPassword") {
      setConfirmPassword(value);
    }
  };

  async function handleResetPassword(e) {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("New password and confirm password do not match.");
      return;
    }

    try {
      const res = await api.patch("/restpassword", {
        oldPassword,
        newPassword,
        confirmPassword
      });
      console.log(res.data);
      Nevigate("/");
      // Handle successful password reset, e.g., redirect to login page
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      style={{ minHeight: "100vh" }}
    >
      <Grid item xs={12} sm={8} md={6} lg={4}>
        <Paper elevation={3} style={{ padding: "20px", textAlign: "center" }}>
          <h1>Change Password </h1>
          <form onSubmit={handleResetPassword}>
            <TextField
              label="Old Password"
              type="password"
              variant="outlined"
              fullWidth
              name="oldPassword"
              value={oldPassword}
              onChange={handleChange}
            />
            <br />
            <br />
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              name="newPassword"
              value={newPassword}
              onChange={handleChange}
            />
            <br />
            <br />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              name="confirmPassword"
              value={confirmPassword}
              onChange={handleChange}
            />
            <br />
            <br />
            <Button type="submit" variant="contained" color="primary" fullWidth>
              Reset Password
            </Button>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default ChangePassword;
