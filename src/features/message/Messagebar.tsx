import React, { FC, ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import { Snackbar } from '@mui/material';
import Alert from '@mui/material/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { display, hideMessage, severity, message } from './messageSlice';

const StyledSnackbar = styled(Snackbar)(({ theme }) => ({
  [theme.breakpoints.down('xs')]: {
    bottom: 90,
  },
}));

const Messagebar: FC = (): ReactElement => {
  const showMessage = useSelector(display);
  const messageSeverity = useSelector(severity);
  const messageText = useSelector(message);
  const dispatch = useDispatch();

  const handleClose = (event: React.SyntheticEvent<any, Event> | Event, reason: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideMessage());
  };

  const handleAlertClose = (event: React.SyntheticEvent<Element, Event>) => {
    dispatch(hideMessage());
  };

  return (
    <StyledSnackbar
      open={showMessage}
      autoHideDuration={6000}
      onClose={handleClose}>

      <Alert onClose={handleAlertClose} severity={messageSeverity}>
        {messageText}
      </Alert>

    </StyledSnackbar>
  );
}

export default Messagebar;
