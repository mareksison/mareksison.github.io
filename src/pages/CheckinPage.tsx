import * as React from 'react'
import axios from 'axios';

import CheckInTextField from '../components/CheckInTextField'
import CheckInList from '../components/CheckInList'
import CheckInChart from '../components/CheckInChart'

import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useAppDispatch } from '../redux/store';
import { updateCheckIns } from '../redux/slices/checkInSlice';

const API_BASE_URL = 'http://localhost:3000'; // base URL

export default function CheckInPage() {
  const { checkInsArray } = useSelector((state: RootState) => state.checkIn);
  const dispatch = useAppDispatch();
  const apiIsActive = false;

  React.useEffect(() => {
    if (apiIsActive){
      axios.get(`${API_BASE_URL}/checkins`)
        .then(response => {
          console.log(response);
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
  );
}