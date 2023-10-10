// import * as Reaccesstokenact from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useState } from "react";
// import axios from "axios";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { IconButton, InputAdornment } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

import api from "./api.js";
// import Dashboard from "../Dashboard/Dashboard.js";

const defaultTheme = createTheme();

export default function Login() {
  const Nevigate = useNavigate();
  const [userdetailadd, setuserdetailsadd] = useState({
    MasterField: "",
    password: "",
    role: "",
  });
  const [visible, setVisible] = useState(true);
  // const [error, setError] = useState("");

  // const handleChange = (e) => {
  //   const { value, name } = e.target;
  //   setuserdetailsadd((val) => ({ ...val, [name]: value }));
  // };
  const handleChange = (e) => {
    const { value, name } = e.target;
    setuserdetailsadd((prevUserDetails) => ({
      ...prevUserDetails,
      [name]: value,
    }));
  };

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/login", userdetailadd);


      console.log(res.data.message);

      const userToken = res.data.accesstoken;
      localStorage.setItem("authorization", userToken);

      if (res.status === 200) {
        toast.success("Success!");
      }

      setTimeout(() => {
        Nevigate("/Dashboard");
      }, 3000);
    } catch (error) {
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

  const EndAdornment = ({ visible, setVisible }) => {
    return (
      <InputAdornment position="end">
        <IconButton onClick={() => setVisible(!visible)}>
          {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
        </IconButton>
      </InputAdornment>
    );
  };

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
            Sign in
          </Typography>
          <Box
            component="form"
            onSubmit={handleSubmit}
            noValidate
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="MasterField"
              label="Username or email or phone"
              name="MasterField"
              onChange={handleChange}
              value={userdetailadd.MasterField}
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              onChange={handleChange}
              value={userdetailadd.password}
              label="Password"
              // type="password"
              type={visible ? "password" : "text"}
              InputProps={{
                endAdornment: (
                  <EndAdornment visible={visible} setVisible={setVisible} />
                ),
              }}
              id="password"
              autoComplete="current-password"
            />
            {/* <TextField
              margin="normal"
              fullWidth
              name="role"
              label="Role"
              onChange={handleChange}
              value={userdetailadd.role}
              type="text"
              id="role"
            /> */}
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
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="/sendotp" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/Sign-Up" variant="body2">
                  {"Don't have an account? Sign Up"}
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
