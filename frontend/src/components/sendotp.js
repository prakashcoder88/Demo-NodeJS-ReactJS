import React, { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
// import { useNavigate } from "react-router-dom";
import api from "./api.js";

function Forgotpassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [EmailSubmit, setEmailSubmit] = useState("");

  const EmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  async function handleEmailSubmit(e) {
    e.preventDefault();

    if (!EmailValid) {
      alert("Email address invalid");
      return;
    }

    try {
      const res = await api.post("/sendemail", { email });
      console.log(res.data);

      setEmailSubmit(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function handleOtpSubmit(e) {
    e.preventDefault();

    if (otp === "") {
      alert("OTP is valid");
    } else {
      try {
        const res = await api.post("/verifyotp", { email, otp });
        console.log(res.data);
        alert("OTP is valid");
      } catch (error) {
        alert("OTP Invalid");
        console.log(error);
      }
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
          <h1>OTP Verify</h1>
          <form onSubmit={EmailSubmit ? handleOtpSubmit : handleEmailSubmit}>
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={EmailSubmit}
            />
            <br />
            <br />
            {EmailSubmit ? (
              <>
                <TextField
                  label="OTP"
                  variant="outlined"
                  fullWidth
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                />
                <br />
                <br />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  href="/resetpassword"
                >
                  Verify OTP
                </Button>
              </>
            ) : (
              <>
                <Button
                  item
                  xs={6}
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={!EmailValid} // Disable if email is not valid
                >
                  Send Email
                </Button>
                &nbsp;&nbsp;
                <Button
                  item
                  xs={6}
                  type="Cancle"
                  variant="contained"
                  color="primary"
                  href="/"
                >
                 Back
                </Button>
              </>
            )}
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Forgotpassword;
