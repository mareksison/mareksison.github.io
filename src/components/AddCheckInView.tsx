import { useState } from 'react';
import dayjs from 'dayjs';

import {
  FormControl,
  FormHelperText,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@mui/material'
import CheckInButton from './CheckInButton';

export default function AddCheckInView(props:any){
  const { date, retrieveCheckIns } = props;

  const [state, setState] = useState({
    id: 1,
    name: 'Admin',
    username: 'admin',
    checkIn: '',
    error: "",
    checkInObjects: {
      success: false,
      objects: [{
        userId: 1,
        hrs: 0,
        tag: '',
        checkinText: '',
        checkinDate: dayjs(dayjs(), 'YYYY-MM-DD'),
        timestamp: dayjs().toString()
      }]
    }
  });
    
  /**
   * clearField clears the input after CheckInButton has been clicked
   */
  const clearField = () => {
    setState({
      ...state,
      checkIn: ''
    });
    retrieveCheckIns();
  }

  /**
   * checkCheckIn is used to parse the check in string
   * as well as check if it's in the right format
   */
  const checkCheckIn = () => {
    // first check if check-in is empty
    if (state.checkIn == ('')){
      setState({
        ...state,
        error: ""
      });
      return
    }

    // get the array of lines
    let objs:any = state.checkIn.split("\n");
    let checkInArray = [];
    let a = [];
    let rowString = '';

    for (let i = 0 ; i < objs.length ; i++){
      a = objs[i].split(' ');
      rowString = 'Row ' + (i+1) + ": ";
  
      // check if there are less than 3 spaces
      if (a.length < 4 || (a.length < 5 && a[0] == '-')){
        // string not in right format
        setState({
          ...state,
          error: rowString + 'please use the format of <number> [hr | hrs] #<tag> <activities>'
        });
        return;
      } else if (a[0] == '-') {
        a = a.slice(1);
      }

      // store if first variable is a number
      let isNumber = parseFloat(a[0]) ? true : false;
      let numHours = 0;
      if (isNumber){
        // it is number
        numHours = parseFloat(a[0]);
      
        // check if hr or hrs are there
        if (a[1].indexOf('hr') < 0){
          // user needs to label the hours
          setState({
            ...state,
            error: rowString + 'please use "hr / hrs" to denote amount of time (format: <number> [hr | hrs] #<tag> <activities>)'
          });
          return;
        }
      } else {
        // user has to fix hours
        setState({
          ...state,
          error: rowString + 'please place the number of hours first (format: <number> [hr | hrs] #<tag> <activities>)'
        });
        return;
      }
  
      // next, check the tag
      let tag = ''
      if (a[2].indexOf('#') == 0){
        tag = a[2].substring(1, a[2].length);
      } else {
        // user needs to use a proper tag
        setState({
          ...state,
          error: rowString + 'please put a hash before your tag (format: <number> [hr | hrs] #<tag> <activities>)'
        });
        return;
      }
  
      // finally save the description
      let description = a[3];
      for (let x = 4 ; x < a.length ; x++){
        description += ' ' + a[x];
      }

      // push numHours, tag, and description in the array
      checkInArray.push({
        userId: state.id,
        hrs: numHours,
        tag: tag,
        checkinText: description,
        checkinDate: date,
        timestamp: dayjs().toString()
      });
    }

    // save numHours, tag, and description somewhere
    setState({
      ...state,
      error: '',
      checkInObjects: {
        success: true,
        objects: [...checkInArray]
      }
    });
    return;
  };

  return (
    <>
      <FormControl
        error={state.error == "" ? false : true}
        variant="standard"
        sx={{
          left:'50%',
          transform: 'translate(-50%, 0)',
          top:'2em',
          width: '40vw',
        }}
      >
        <InputLabel
          sx={{
            left:'0.88em',
            top:'-0.4em'
          }}
        >
          Check-In
        </InputLabel>
        <OutlinedInput
          id="check-in-field"
          label="Check-In"
          multiline
          rows={6}
          aria-label="check-in-field"
          aria-describedby="component-error-text"
          value={state.checkIn}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            // save the text to the state
            setState({
              ...state,
              checkIn: event.target.value
            });
          }}
          onBlur={() => {
            checkCheckIn();
          }}
          endAdornment={
            <InputAdornment position="end" sx={{position: 'absolute', top: '28px', right: '19px'}}>
              <CheckInButton
                clearField={clearField}
                objects={state.checkInObjects.objects}
                success={state.checkInObjects.success}
              />
            </InputAdornment>
          }
        />
        {/* explore to see if you can add the add button into the field using InputAdornment */}
        <FormHelperText id="component-error-text">
          {state.error}
        </FormHelperText>
      </FormControl>
    </>
  );
}
