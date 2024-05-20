import * as React from 'react';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Alert from '@mui/material/Alert';



export default function SimpleSnackbar({open, setOpen, snackbarState}) {
// console.log(snackbarState)

  // const [open, setOpen] = React.useState(false);

  // default message
    if(snackbarState?.msg === null){
      snackbarState.msg = "Shortened URL Successfully Copied inside yours device clipboard!";
    }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };


  const action = (
    <React.Fragment>

      <IconButton
        size="small"
        aria-label="close"
        color="inherit"
        onClick={handleClose}
      >
        <CloseIcon fontSize="small" />
      </IconButton>
    </React.Fragment>
  );


  return (
    <div>
      {/* <Button onClick={()=>{openTheSnackBar(setOpen)}}>Open Snackbar</Button> */}
      <Snackbar  open={open} onClose={handleClose} autoHideDuration={2000}   anchorOrigin={{vertical: 'top', horizontal:'right'}}>
        <Alert
       
        onClose={handleClose}
        severity={snackbarState?.successOrError}
        variant="filled"
        sx={{ width: '100%' }}
      
      >
        {snackbarState?.msg}
      </Alert>      
      </Snackbar>
        


      
    </div>
  );
}

export function useSetInitialStateSnackbar(){
  const [open, setOpen] = React.useState(false);
  return  [open, setOpen];
}
export function openTheSnackBar(setOpen){
  setOpen(true);
};