import { useState, useEffect } from 'react';
import dayjs, { Dayjs } from 'dayjs';

import {
  Avatar,
  Card,
  CardHeader,
  Stack
} from '@mui/material'

// import { IconButton } from '@mui/material'
// import ViewAgendaOutlinedIcon from '@mui/icons-material/ViewAgendaOutlined';
// import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';

import { deepOrange } from '@mui/material/colors';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import AddCheckInView from '../components/AddCheckInView';
import AllCheckInsView from '../components/AllCheckInsView';
import AllCheckInsViz from '../components/AllCheckInsViz';
import ViewToggleButton from '../components/ViewToggleButton';

import service from '../service/Service'
import { useSnackbarVariants } from '../hooks/SnackbarVariants';

export default function CheckInForm(){
  // const [view, setView] = useState('add'); // old - two possible views are 'add' and 'all'
  const [date, setDate] = useState(dayjs(dayjs(), 'YYYY-MM-DD')) // date state with today as default
  const [view, setView] = useState('list'); // two possible views are 'list' and 'viz'
  const [user, setUser] = useState({
    id: 1,
    name: 'Admin',
    username: 'admin',
    team: 'Software Engineering',
    retrievedCheckIns: [{}]
  });
  const enqueueSnackbar = useSnackbarVariants();

  // const onClick = async () => {
  //   if (view === 'add'){
  //     setView('all');
  //   } else {
  //     setView('add');
  //   }
  // }

  const retrieveCheckIns = async () => {
    // get from DB and store in retrievedCheckIns
    await service.get('/checkin/search/'+user.id, {},
      (response:any) => {
        enqueueSnackbar.info('Your check-ins have been updated');
        const { data } = response; 

        data.sort(function(a:any, b:any){
          if (a.checkinDate == b.checkinDate){
            return b.timestamp - a.timestamp;
          } else {
            return b.checkinDate - a.checkinDate;
          }
        });
        
        setUser({
          ...user,
          retrievedCheckIns: [...data]
        });
      },
      (err:any) => {
        enqueueSnackbar.error('Error: ' + err);
      }
    );
  }

  useEffect(() => {
    retrieveCheckIns();
  }, []);

  return (
    <Card sx={{
      width: '50vw',
      height: '80vh',

      // center align card to screen
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    }}>
      <CardHeader
        avatar={
          <Avatar sx={{ bgcolor: deepOrange['A400'] }} aria-label="user-header">
            {user.name.substring(0, 1).toUpperCase()}
          </Avatar>
        }
        action={
          <>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                value={date}
                onChange={(newDate) => setDate(dayjs(newDate, 'YYYY-MM-DD'))}
              />
            </LocalizationProvider>
            { /* I once thought of having the view change, but I figure it better to have it all together on one view */ }
            {/* <IconButton
              aria-label="change-view"
              onClick={onClick}
            >
              {view === 'add' ? <ViewAgendaOutlinedIcon /> : <AddBoxOutlinedIcon />}
            </IconButton>  */}
          </>
        }
        title={user.name}
        subheader={user.team}
        sx={{ textAlign: 'left' }}
      />
        <Stack direction="column" spacing={5}>
          <AddCheckInView retrieveCheckIns={retrieveCheckIns} date={date} />
          <ViewToggleButton view={view} setView={setView} />
          { view === 'list' ? 
            <AllCheckInsView retrieveCheckIns={retrieveCheckIns} retrievedCheckIns={user.retrievedCheckIns}/> :
            <AllCheckInsViz retrievedCheckIns={user.retrievedCheckIns}/>
          }
        </Stack>
    </Card>
  );
}
