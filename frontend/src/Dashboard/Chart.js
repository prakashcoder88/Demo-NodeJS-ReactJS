import * as React from 'react';
import { useEffect, useState } from "react";
import api from "../components/api";
// import Title from './Title';




export default function Chart() {


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


  return (
    
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
  );
}