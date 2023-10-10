import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";

import api from "./api.js";

function ResetPassword() {
  const [newpasswordadd, setNewPassword] = useState({
    newpassword: ""
  });
  const [confirmpasswordadd, setConfirmPassword] = useState({
    confirmpassword: ""
  });
  const [email, setEmail] = useState({
    email:"email"
  }); 
  

  async function handleResetPassword(e) {
    e.preventDefault();

    if (newpasswordadd !== confirmpasswordadd) {
      alert("Passwords do not match");
      return;
    }

    try {
      const res = await api.post("/forgotpassword", {
        newpasswordadd,
        confirmpasswordadd,
      });
      console.log(res.data);
      // Handle successful password reset, e.g., redirect to login page
    } catch (error) {
      console.log(error);
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
          <h1>Reset Password Page</h1>
          <form onSubmit={handleResetPassword}>
          <TextField
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              value={email.email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={email}
            />
            <br />
            <br />
            <TextField
              label="New Password"
              type="password"
              variant="outlined"
              fullWidth
              value={newpasswordadd.newpassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <br />
            <br />
            <TextField
              label="Confirm Password"
              type="password"
              variant="outlined"
              fullWidth
              value={confirmpasswordadd.confirmpassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

export default ResetPassword;
