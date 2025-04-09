import * as React from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';

import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';
import { useAppDispatch } from '../redux/store';
import { deleteCheckIn, isEditingFalse, isEditingTrue } from '../redux/slices/checkInSlice';

import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // base URL

export default function CheckInList() {
  const { checkInsArray, editingRow, isEditing } = useSelector((state: RootState) => state.checkIn);
  const dispatch = useAppDispatch();

  // const handleSubmit = (i, id) => {
  //   dispatch(isEditingFalse());
  // };

  // const handleEdit = (i) => {
  //   dispatch(isEditingTrue(i));
  // };
  
  const handleDelete = async (i:number, id:any) => {
    try {
      await axios.delete(`http://localhost:3000/checkins/${id}`)
        .then(response => {
          console.log(response);
          dispatch(deleteCheckIn(i));
        })
        .catch(error => {
          console.error('Failed to delete checkin:', error);
        });
      console.log(`Check-in ${id} deleted successfully.`);
    } catch (error) {
      console.error('Error deleting check-in:', error);
    }
  };

  return (
    <Box
      sx={{
        height: 300, // or any height you want
        overflowY: 'auto',
        border: '1px solid #ccc',
        borderRadius: 2,
        p: 1,
      }}
    >
      <List style={{ width: '70vw' }}>
        {checkInsArray.map((x, index) => {
          return (
            <ListItem
              divider
              secondaryAction={
                <>
                  {/* {
                    (isEditing && index == editingRow) ?
                    <IconButton edge="end" onClick={() => handleSubmit(index, x.id)}>
                      <CheckIcon />
                    </IconButton> : <></>
                  }
                  <IconButton edge="end" onClick={() => handleEdit(index)}>
                    <EditIcon />
                  </IconButton> */}
                  <IconButton edge="end" onClick={() => handleDelete(index, x.id)}>
                    <DeleteIcon />
                  </IconButton>
                </>
              }
            >
              <ListItemText
                primary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body1"
                      sx={{ color: 'text.primary', display: 'inline'}}
                    >
                      {x.subject}
                    </Typography>
                  </React.Fragment>
                }
                sx={{width: '20%'}}
              />
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      sx={{ color: 'text.primary', display: 'inline', width: '20%'  }}
                    >
                      {x.hours + " " + (x.hours === 1 ? "hr" : "hrs")}
                    </Typography>
                  </React.Fragment>
                }
                sx={{width: '20%'}}
              />
              <ListItemText
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body1"
                      sx={{ color: 'text.primary', display: 'inline'}}
                    >
                      {x.notes}
                    </Typography>
                  </React.Fragment>
                }
                sx={{width: '20%'}}
              />
            </ListItem>
          )
        })}
      </List>
    </Box>
  );
}
