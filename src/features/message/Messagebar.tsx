import React, { FC, ReactElement } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    snackbar: {
      [theme.breakpoints.down('xs')]: {
        bottom: 90,
      },
    },
  }),
);

const Shops: FC = (): ReactElement => {
 
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      className={classes.snackbar}>

      <Alert onClose={handleClose} severity="success">
        This is a success message!
      </Alert>

    </Snackbar>
  );
}

export default Shops;
