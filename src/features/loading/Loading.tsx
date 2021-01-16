import React, { FC, ReactElement } from 'react';
import Backdrop from '@material-ui/core/Backdrop';
import CircularProgress from '@material-ui/core/CircularProgress';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { useDispatch, useSelector } from 'react-redux';
import { loadingState, resetToIdle } from './loadingSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: '#fff',
    },
  }),
);

const LoadingIndicator: FC = (): ReactElement => {

  const classes = useStyles();
  const loadingStatus = useSelector(loadingState);
  const dispatch = useDispatch();

  const showLoadingIndicator = loadingStatus === 'pending' ? true : false;

  const handleClose = () => {
    dispatch(resetToIdle());
  };

  return (
    <div>
      <Backdrop className={classes.backdrop} open={showLoadingIndicator} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}

export default LoadingIndicator;
