import * as React from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";



const defaultTheme = createTheme();

export default function SignUp() {
  const [userdetailadd, setuserdetailsadd] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "",
  });
  const handleChange = (e) => {
    const { value, name } = e.target;
    setuserdetailsadd((val) => ({ ...val, [name]: value }));
  };

  async function Submitdata(e) {
    e.preventDefault();
    try {
      const res = await axios.post(
        "http://127.0.0.1:5000/user/register",
        userdetailadd
      );
     
      console.log(res.data.message);
      if (res.status === 201) {
        toast.success("Successfully register");
    
      } else {
        toast.error("User not register");
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        const { status, data } = error.response;
        if (status === 401) {
          toast.error(data.message);
        } else if (status === 403) {
          toast.error(data.message);
        } else if (status === 404) {
          toast.error(data.message);
        } else {
          toast.error(data.message);
        }
      } else if (error.request) {
        toast.error("Network error. Please try again later.");
      } else {
        console.error(error);
        toast.error("An error occurred. Please try again.");
      }
    }
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}></Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={Submitdata} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  type="text"
                  name="name"
                  onChange={handleChange}
                  value={userdetailadd.name}
                  fullWidth
                  id="name"
                  label="Full Name"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  type="text"
                  fullWidth
                  id="email"
                  onChange={handleChange}
                  value={userdetailadd.email}
                  label="Email Address"
                  name="email"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="password"
                  onChange={handleChange}
                  value={userdetailadd.password}
                  fullWidth
                  label="Password"
                  type="password"
                  id="password"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  name="phone"
                  onChange={handleChange}
                  value={userdetailadd.phone}
                  fullWidth
                  label="Phone"
                  type="number"
                  id="phone"
                />
              </Grid>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Role</InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={userdetailadd.role}
                    label="Role"
                    name="role"
                    onChange={handleChange}
                  >
                    <MenuItem value="admin">Admin</MenuItem>
                    <MenuItem value="user">User</MenuItem>
                    <MenuItem value="supervisor">Supervisor</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
      <ToastContainer />
    </ThemeProvider>
  );
}
