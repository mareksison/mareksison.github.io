import * as React from 'react';
import {
  Box,
  Button,
  FormHelperText,
  OutlinedInput
} from '@mui/material';
import FormControl, { useFormControl } from '@mui/material/FormControl';

import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useAppDispatch } from '../redux/store';
import { checkInsError, clearError, isErrorFalse, isErrorTrue, updateCheckIns, updateText } from '../redux/slices/checkInSlice';
import CheckInObject from './CheckInObject';

import axios from 'axios';
import { EnvObj } from '../EnvObj.tsx';

const { API_BASE_URL } = EnvObj; // base URL

export default function CheckInTextField() {
  const { helperValue, isError, textValue } = useSelector((state: RootState) => state.checkIn);
  const { accessToken } = useSelector((state: RootState) => state.login);
  const dispatch = useAppDispatch();

  const handleChange = (event) => {
    dispatch(updateText(event.target.value));
  };

  /**
   * Recursive method that checks the regex against the array of lines that comes from the input
   * @param arr 
   * @param x 
   * @returns true if there is an error and false if there isn't
   */
  const checkCheckInArray = (arr, x = 0) => {
    return arr[x].match(/(- )?(\d+(\.\d+)?)\s*hrs?\s*#(\S+)\s*(.+)/g) ? (
      x+1 >= arr.length ? false : checkCheckInArray(arr, x+1)
     ) : true;
  }

  /**
   * Recursive method that concatenates strings in an array
   * @param arr 
   * @param x 
   * @param s 
   * @returns the full concatenated string
   */
  const concatArray = (arr, x = 0, s = "") => {
    return x+1 > arr.length ? s : concatArray(arr, x+1, s == "" ? s.concat(arr[x]) : s.concat(" ", arr[x]));
  }

  /**
   * Recursive method that checks the regex against the array of lines that comes from the input
   * @param arr 
   * @param newArr 
   * @param x 
   * @returns true if there is an error and false if there isn't
   */
  const createCheckInArray = (arr, newArr:CheckInObject[] = [], x = 0) => {
    const textArr = arr[x].split(" ");
    const startIndex = textArr[0] == "-" ? 1 : 0;

    newArr.push({
      hours: Number(textArr[startIndex]),
      subject: textArr[startIndex+2].substring(1),
      notes: concatArray(textArr.slice(startIndex+3))
    });

    return x+1 >= arr.length ? newArr : createCheckInArray(arr, newArr, x+1);
  }
  
  /**
   * Checks text validation. Is called when the input field is deselected
   */
  const validateText = () => {
    const checkInArray = textValue.split('\n');
    const e = checkCheckInArray(checkInArray);

    if (e){
      dispatch(checkInsError());
      dispatch(isErrorTrue());
    } else {
      dispatch(clearError());
      dispatch(isErrorFalse());
    }

    return checkInArray;
  };

  const submitCheckIns = () => {
    const checkInArray = validateText();

    if (!isError){
      const checkInObjArray = createCheckInArray(checkInArray);
      dispatch(updateCheckIns(checkInObjArray));
      dispatch(updateText(""));
      axios.post(`${API_BASE_URL}/checkins`,
        checkInObjArray
      )
        .then(response => {
          console.log(response);
          // get checkins and update list
          axios.get(`${API_BASE_URL}/checkins`)
            .then(response => {
              console.log(response);
              dispatch(updateCheckIns(response.data));
            })
            .catch(error => {
              console.error('Failed to fetch checkins:', error);
            });
        })
        .catch(error => {
          console.error('Failed to fetch checkins:', error);
        });
    }
  }
  
  /**
   * Helper text component, instantiated inside to make use of the FormControl
   */
  function CheckInHelperText() {
    const { focused } = useFormControl() || {};
  
    const helperText = React.useMemo(() => {

      if (!focused && textValue) {
          validateText();
      } else {
          dispatch(clearError());
      }
  
      return helperValue;
    }, [focused]);
  
    return <FormHelperText>{helperText}</FormHelperText>;
  }
  
  React.useEffect(() => {
    if (accessToken){
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
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '70vw' } }}
      noValidate
      autoComplete="off"
    >
      <FormControl>
        <OutlinedInput
          error={isError}
          fullWidth
          multiline
          onChange={handleChange}
          value={textValue}
        />
        <CheckInHelperText />
        <Button
          onClick={submitCheckIns}
        >
          Submit Check-In
        </Button>
      </FormControl>
    </Box>
  );
}
