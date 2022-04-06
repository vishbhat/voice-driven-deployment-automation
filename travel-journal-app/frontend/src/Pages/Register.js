import React, { useState } from "react";
import axios from "axios";
import bcrypt from "bcryptjs";
import { styled } from '@mui/system'
import { Box, TextField, Button, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const salt = "$2a$10$7dwi7POb8TuwUoFsGqNm1e";
const API_URL = "http://44.193.194.164:5000/signup";


const FormTab = styled('div')(({ theme }) => ({
  margin: "10px",
  padding: theme.spacing(1),
  boxShadow: "0 0 10px -1px",
  borderRadius: "10px",
  border: "1px solid lightgray",
  color: theme.palette.main,
  width: '50ch'
}))


function Register() {

  const navigate = useNavigate();

  const defaultValues = {
    firstname: "",
    lastname: "",
    email: "",
    password: ""
  };

  const [formValues, setFormValues] = useState(defaultValues);


  function handleSubmit(event) {
   
    const body = {
      firstname: formValues.firstname,
      lastname: formValues.lastname,
      email: formValues.email,
      password: bcrypt.hashSync(formValues.password, salt)
    };
    
    console.log(body);
    axios({
      method: "post",
      url: API_URL,
      data: body,
    }).then((res) => {
      if (res.data.status) {
        alert("Thanks for the sign up!");
        navigate("/login", { state: { email: formValues.email } });

      } else {
        alert("Something went wrong, please try again!");
      }
    });
    event.preventDefault();
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
        <h3>Register</h3>
        <form onSubmit={handleSubmit}>
          <Box sx={{ display: 'flex', flexDirection: 'column', m: 1, alignItems: 'center' }}>
          <TextField
              required
              label="First Name"
              id="firstname"
              type="text"
              sx={{ m: 1, width: '30ch' }}
              value={formValues.firstname}
              onChange={handleInputChange}
            />
            <TextField
              required
              label="Last Name"
              id="lastname"
              type="lastname"
              sx={{ m: 1, width: '30ch' }}
              value={formValues.lastname}
              onChange={handleInputChange}
            />
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
              value={formValues.password}
              onChange={handleInputChange}
            />
            <Button variant="contained" sx={{ m: 1, width: '15ch' }} type="submit"> Register </Button>
            Already registered?<Link to="/login">
              Sign In
            </Link>
           
          </Box>
        </form>
      </FormTab>
    </Box>
  );
}

export default Register;
