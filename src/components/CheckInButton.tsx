import {
    IconButton
} from '@mui/material'
import dayjs from 'dayjs';

import AddCircleIcon from '@mui/icons-material/AddCircle';

import service from '../service/Service'
import { useSnackbarVariants } from '../hooks/SnackbarVariants';

export default function CheckInButton(props:any){
  const { clearField, objects, success } = props;
  const enqueueSnackbar = useSnackbarVariants();
    
  /**
   * handleClick takes the objects and pushes them into the db
   */
  const handleClick = () => {
    let postObj = [...objects];
    const timestamp = dayjs().toString();

    for ( let x = 0 ; x < objects.length ; x++){
      postObj[x].timestamp = timestamp;
    }

    // push objects under date into the db
    service.post('/checkin', postObj, {},
      (response:any) => {
        console.log("SUCCESSFULLY ADDED!!!");
        enqueueSnackbar.success('Successfully uploaded check-ins!');
      },
      (err:any) => {
        enqueueSnackbar.error('Error: ' + err);
        return
      }
    );

    enqueueSnackbar.success('Successfully uploaded check-ins!');
    // empty field and alert that check-in was successfully added
    clearField();
  };

  return (
    <IconButton
      aria-label="add check-in button"
      disabled={!success} // disable if checkInObjects is not yet in proper format
      onClick={handleClick} // once clicked, handleClick will push to the DB
      edge="end"
    >
      <AddCircleIcon />
    </IconButton>
  );
}
