import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

import {
  Box,
  Button,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography
} from '@mui/material';
import FormControl, { useFormControl } from '@mui/material/FormControl';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';

import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useAppDispatch } from '../redux/store';
import { login, loginErrorFalse, loginErrorTrue, toggleShowPassword, updatePw, updateUser } from '../redux/slices/loginSlice';

import { EnvObj } from '../EnvObj.tsx';

const { API_BASE_URL } = EnvObj; // base URL

export default function LoginPage() {
  const { loginError, pw, showPassword, user } = useSelector((state:RootState) => state.login);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  
  const handleUserChange = (event) => {
    dispatch(updateUser(event.target.value));
  };
  
  const handlePwChange = (event) => {
    dispatch(updatePw(event.target.value));
  };

  const handleClickShowPassword = () => {
    dispatch(toggleShowPassword());
  };

  const handleLogin = async (event) => {
    console.log("clicked to login!");
    try {
      loginErrorFalse();
      const response = await axios.post(`${API_BASE_URL}/auth/login`, {
        username: user,
        password: pw,
      });
  
      const { token } = response.data;
  
      localStorage.setItem('checkInAccessToken', token);
      dispatch(login(token));
      navigate('/checkin');
  
      return token;
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      loginErrorTrue();
      throw error;
    }
  }

  const handleCreateUser = async (event) => {
    try {
      loginErrorFalse();
      const response = await axios.post(`${API_BASE_URL}/users`, {
        username: "mareksison",
        password: "123password",
      });
      
    } catch (error) {
      console.error('Create failed:', error.response?.data || error.message);
      throw error;
    }
  }
    
  /**
   * Helper text component, instantiated inside to make use of the FormControl
   */
  function LoginHelperText() {
    const helperText = React.useMemo(() => {
      return loginError ? "Wrong username or password" : ""
    }, [loginError]);
  
    return <FormHelperText>{helperText}</FormHelperText>;
  }

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '40vw', display: 'flex', flexWrap: 'wrap'} }}
      noValidate
      autoComplete="off"
    >
      <Typography align={"center"} variant={'h3'} sx={{color:'black'}}>Login for your Check-In</Typography>
      <FormControl sx={{ m: 1 }}>
        <InputLabel>Username</InputLabel>
        <OutlinedInput
          error={loginError}
          fullWidth
          onChange={handleUserChange}
          value={user}
        />
      </FormControl>
      <FormControl sx={{ m: 1 }}>
        <div>
          <InputLabel>Password</InputLabel>
          <OutlinedInput
            error={loginError}
            fullWidth
            onChange={handlePwChange}
            value={pw}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOffIcon/> : <VisibilityIcon/>}
                </IconButton>
              </InputAdornment>
            }
          />
        </div>
        <LoginHelperText />
        <Button
          onClick={handleLogin}
        >
          Log In
        </Button>
        {/* <Button
          onClick={handleCreateUser}
        >
          Create User
        </Button> */}
      </FormControl>
    </Box>
  );
}
