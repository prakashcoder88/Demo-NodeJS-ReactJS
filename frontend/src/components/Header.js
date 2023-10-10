import React, { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import "./common.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import api from "./api.js";

function Header() {
  const [userdetail, setuserdetails] = useState([]);

  async function getalluserdetails() {
    try {
      const result = await api.get("/userdetailall");

      setuserdetails(result.data.userfind);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    getalluserdetails();
  }, []);

  const Nevigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const res = await api.post("/logout");
      Nevigate("/");
    } catch (error) {
      console.log(error);
    }
    
  }
  return (
    <>
      <table>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Role</th>
          <th>Created</th>
        </tr>
        {userdetail?.map((value, id) => {
          return (
            <>
              <tr key={value.id}>
                <td>{value.name}</td>
                <td>{value.email}</td>
                <td>{value.phone}</td>
                <td>{value.role}</td>
                <td>{value.created}</td>
              </tr>
            </>
          );
        })}
      </table>

      <Button
        type="submit"
        onClickCapture={handleSubmit}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Logout
      </Button>
    </>
  );
}
export default Header;
