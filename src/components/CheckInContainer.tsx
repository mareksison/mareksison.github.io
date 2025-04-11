import * as React from 'react'

import './App.css'
import CheckInTextField from './CheckInTextField'
import CheckInList from './CheckInList'
import CheckInChart from './CheckInChart'

import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useAppDispatch } from '../redux/store';
import { updateCheckIns } from '../redux/slices/checkInSlice';

import { EnvObj } from '../EnvObj.tsx';

const { API_BASE_URL } = EnvObj; // base URL

import axios from 'axios';

export default function CheckInContainer() {
  const { checkInsArray } = useSelector((state: RootState) => state.checkIn);
  const dispatch = useAppDispatch();
  const apiIsActive = false;

  React.useEffect(() => {
    if (apiIsActive){
      axios.get(`${API_BASE_URL}/checkins`)
        .then(response => {
          dispatch(updateCheckIns(response.data));
        })
        .catch(error => {
          console.error('Failed to fetch checkins:', error);
        });
    }
  }, []);

  return (
    <>
      <CheckInTextField/>
      { checkInsArray.length > 0 ?
        <>
          <CheckInList/>
          <CheckInChart/>
        </>
      : <></> }
    </>
  )
}
