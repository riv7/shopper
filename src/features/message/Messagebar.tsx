import React, { FC, ReactElement } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';
import { useDispatch, useSelector } from 'react-redux';
import { display, hideMessage, severity } from './messageSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    snackbar: {
      [theme.breakpoints.down('xs')]: {
        bottom: 90,
      },
    },
  }),
);

const Messagebar: FC = (): ReactElement => {
  
  const classes = useStyles();
  const showMessage = useSelector(display);
  const messageSeverity = useSelector(severity)
  const dispatch = useDispatch();

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    dispatch(hideMessage());
  };

  return (
    <Snackbar
      open={showMessage}
      autoHideDuration={6000}
      onClose={handleClose}
      className={classes.snackbar}>

      <Alert onClose={handleClose} severity={messageSeverity}>
        This is a message with severity {messageSeverity}
      </Alert>

    </Snackbar>
  );
}

export default Messagebar;
