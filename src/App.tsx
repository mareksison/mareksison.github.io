import './App.css';
import { SnackbarProvider } from 'notistack';

import CheckInForm from './forms/CheckInForm';

function App() {
  return (
    <SnackbarProvider
      autoHideDuration={10000}
      disableWindowBlurListener
      anchorOrigin={{
        vertical:'top',
        horizontal: 'right'
      }}
    >
      <div className="App">
        <CheckInForm/>
      </div>
    </SnackbarProvider>
  );
}

export default App;
