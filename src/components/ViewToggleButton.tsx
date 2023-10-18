import {
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material'

import ReorderIcon from '@mui/icons-material/Reorder';
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined';

export default function ViewToggleButton(props:any){
  const { view, setView } = props;

  const handleView = (
    event: React.MouseEvent<HTMLElement>,
    newView: string,
  ) => {
    setView(newView);
  };

  return (
      
  <ToggleButtonGroup
    value={view}
    exclusive
    onChange={handleView}
    aria-label="view-toggle-button"
    sx={{
      position: 'relative',
      left:'45%',
      top: '2vh'
    }}
  >
    <ToggleButton value="list" aria-label="list of check-ins">
      <ReorderIcon/>
    </ToggleButton>
    <ToggleButton value="viz" aria-label="viz of check-ins">
      <InsertChartOutlinedIcon/>
    </ToggleButton>
  </ToggleButtonGroup>
  );
}
