import * as React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom';

import LoginPage from './pages/LoginPage';
import CheckInPage from './pages/CheckInPage';
import './App.css'

import { useSelector } from 'react-redux';
import { useAppDispatch } from './redux/store';
import { login } from './redux/slices/loginSlice';

function App() {
  const { accessToken } = useSelector((state) => state.login);
  const dispatch = useAppDispatch();
  
  React.useEffect(() => {
    if (localStorage.getItem("checkInAccessToken") && !accessToken){
      dispatch(login(localStorage.getItem("checkInAccessToken")));
    }
  }, []);

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/checkin" element={!accessToken ? <CheckInPage /> : <Navigate to="/login" />} />
      </Routes>
    </>
  )
}

export default App
