import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import bcrypt from "bcryptjs";

import { styled } from '@mui/system'
import { Box, TextField, Button } from "@mui/material";

const salt = "$2a$10$7dwi7POb8TuwUoFsGqNm1e";
const API_URL = "http://44.193.194.164:5000/login";

const FormTab = styled('div')(({ theme }) => ({
  margin: "10px",
  padding: theme.spacing(1),
  boxShadow: "0 0 10px -1px",
  borderRadius: "10px",
  border: "1px solid lightgray",
  color: theme.palette.main,
  width: '50ch'
}))

function Login() {

  const defaultValues = {
    email: "",
    password: ""
  };
  const [formValues, setFormValues] = useState(defaultValues);

  const navigate = useNavigate();

  function handleSubmit(event) {

    event.preventDefault();
    const body = {
      email: formValues.email,
      password: bcrypt.hashSync(formValues.password, salt),
    };

    axios({
      method: "post",
      url: API_URL,
      data: body,
    }).then((res) => {
      if (res.data.status) {
        alert("Successful Login!");
        navigate("/blogs", { state: { userId: res.data.data } });
      } else {
        alert("Incorrect ID & Pasword!");
      }
    });

  }

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormValues(prevState => ({
      ...prevState,
      [id]: value
    }))
  };


  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, alignItems: 'center', height: '86.5vh' }}>
      <FormTab>
        <h3>Sign In</h3>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, alignItems: 'center' }}>
            <TextField
              required
              label="Email"
              id="email"
              type="email"
              sx={{ m: 1, width: '30ch' }}
              value={formValues.email}
              onChange={handleInputChange}
            />
            <TextField
              required
              label="Password"
              id="password"
              type="password"
              sx={{ m: 1, width: '30ch' }}
              value={formValues.address}
              onChange={handleInputChange}
            />
            <Button variant="contained" sx={{ m: 1, width: '15ch' }} type="submit"> Sign In </Button>
            Not a user?<Link to="/signup">
              Sign Up
            </Link>
          </Box>
        </form>
      </FormTab>
    </Box>
  );
}

export default Login;