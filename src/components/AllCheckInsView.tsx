import { useState } from 'react';
import dayjs from 'dayjs';

import {
  Avatar,
  Card,
  CardHeader,
  IconButton,
  Paper,
  TextField,
  Typography,
  Stack
} from '@mui/material'

import { blue } from '@mui/material/colors';

import DeleteIcon from '@mui/icons-material/Delete';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import UpgradeIcon from '@mui/icons-material/Upgrade';
import EditIcon from '@mui/icons-material/Edit';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import service from '../service/Service'
import { useSnackbarVariants } from '../hooks/SnackbarVariants';

export default function AllCheckInsView(props:any){
  const { retrieveCheckIns, retrievedCheckIns } = props;
  const [state, setState] = useState({
    isEdit: -1,
    date: dayjs(),
    text: '',
  });
  const enqueueSnackbar = useSnackbarVariants();

  const handleDelete = (toDel:number) => {
    service.delete('/checkin/'+toDel, {},
      (response:any) => {
        enqueueSnackbar.success('Successfully deleted that check-in (id: ' + toDel + ')!');
        retrieveCheckIns();
      },
      (err:any) => {
        enqueueSnackbar.error('Error: ' + err);
        retrieveCheckIns();
      }
    );
  }

  const handleEdit = (id:number, text:string, date:any) => {
    if (state.isEdit === id){
      setState({
        isEdit: -1,
        date: dayjs(),
        text: '',
      });
    } else {
      setState({
        isEdit: id,
        date: dayjs(date),
        text: text,
      });
    }
  }

  const handleUpdate = (toUpd:number, object:any) => {
    setState({
      isEdit: -1,
      date: dayjs(),
      text: '',
    });

    service.patch('/checkin/'+toUpd, object, {},
      (response:any) => {
        enqueueSnackbar.success('Successfully updated check-in (id: ' + object.id + ')!');
        retrieveCheckIns();
      },
      (error:any) => {
        enqueueSnackbar.error('Error: '+error);
        retrieveCheckIns();
      }
    );
  }

  /**
   * checkCheckIn is back but at a smaller scale
   */
  const checkCheckIn = (s:string) => {
    if (s == ('')){
      return null;
    }

    const a:Array<string> = s.split(' ');

    if (s.length < 4){
      enqueueSnackbar.warning('Please use the format of <number> [hr | hrs] #<tag> <activities>');
      return null;
    }

    let isNumber = parseFloat(a[0]) ? true : false;
    let numHours = 0;
    if (isNumber){
      numHours = parseFloat(a[0]);
    
      if (a[1].indexOf('hr') < 0){
        enqueueSnackbar.warning('Please use "hr / hrs" to denote amount of time (format: <number> [hr | hrs] #<tag> <activities>)');
        return null;
      }
    } else {
      enqueueSnackbar.warning('Please place the number of hours first (format: <number> [hr | hrs] #<tag> <activities>)');
      return null;
    }

    let tag = ''
    if (a[2].indexOf('#') == 0){
      tag = a[2].substring(1, a[2].length);
    } else {
      enqueueSnackbar.warning('Please put a hash before your tag (format: <number> [hr | hrs] #<tag> <activities>)');
      return null;
    }

    let description = a[3];
    for (let x = 4 ; x < a.length ; x++){
      description += ' ' + a[x];
    }

    return ({
      hrs:numHours,
      tag:tag,
      checkinText:description
    });
  };

  return (
    <Paper sx={{
      position: 'absolute',
      left: '50%',
      top: '45%',
      transform: 'translate(-50%, 0)',
      maxHeight: '20em',
      overflow: 'auto'
    }}>
      {
        retrievedCheckIns.map((item:any) => {
          // parse the items' check-in details
          const id = item.id;
          const userId = item.userId;
          const hrs = item.hrs;
          const tag = item.tag;
          const checkinText = item.checkinText;
          const checkinDate = dayjs(item.checkinDate).format('YYYY-MM-DD').toString();

          const handleDelClick = (
            event: React.MouseEvent<HTMLElement>
          ) => {
            handleDelete(id);
          }

          const handleEditClick = (
            event: React.MouseEvent<HTMLElement>
          ) => {
            handleEdit(id, hrs + ' ' + (hrs > 1 ? 'hrs' : "hr") + ' #' + tag + ' ' + checkinText, checkinDate);
          }

          const handleUpdClick = (
            event: React.MouseEvent<HTMLElement>
          ) => {
            const c = checkCheckIn(state.text);

            if (!c){
              setState({
                isEdit: -1,
                date: dayjs(),
                text: '',
              });
              return;
            }

            const obj = {
              id: id,
              userId: userId,
              text: state.text,
              hrs: c.hrs,
              tag: c.tag,
              checkinText: c.checkinText,
              checkinDate: state.date,
              timestamp: dayjs().toString()
            };
            handleUpdate(id, obj);
          }

          return (
            <Card
              sx={{
                width: '40vw'
              }}
            >
              <CardHeader
                avatar={
                  <Avatar sx={{ bgcolor: blue['A400'] }} variant="square" aria-label="check-in hours">
                    { state.isEdit === id ? <EditIcon/> : hrs + ''}
                  </Avatar>
                }
                action={
                  <Stack direction="row" spacing={2}>
                    <Typography variant='h3' sx={{position:'relative !important', fontSize: '1.5vh', top: '15px'}}>
                      { state.isEdit === id ? '' : checkinDate }
                    </Typography>
                    {
                      state.isEdit === id ?
                      <IconButton
                        aria-label="update"
                        onClick={handleUpdClick}
                      >
                        <UpgradeIcon/>
                      </IconButton> :
                      <IconButton
                        aria-label="edit"
                        onClick={handleEditClick}
                      >
                        <ModeEditIcon/>
                      </IconButton>
                    }
                    <IconButton
                      aria-label="delete"
                      value={id}
                      onClick={handleDelClick}
                    >
                      <DeleteIcon/>
                    </IconButton>
                  </Stack>
                }
                title={ state.isEdit === id ? 
                  <>
                    <TextField
                      value={state.text}
                      onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setState({
                          ...state,
                          text: event.target.value
                        });
                      }}
                      sx={{width:'22vw'}}
                    />
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DatePicker
                        value={state.date}
                        sx={{width:'22vw'}}
                        onChange={(newDate) => setState({...state, date:dayjs(newDate, 'YYYY-MM-DD')})}
                      />
                    </LocalizationProvider>
                  </> : checkinText
                }
                subheader={ state.isEdit === id ? '' : '#' + tag }
                sx={{ textAlign: 'left' }}
              />
            </Card>
          );
        })
      }
    </Paper>
  );
};