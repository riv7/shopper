import React, { FC, ReactElement } from 'react';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { styled } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { loadingState, resetToIdle } from './loadingSlice';

const StyledBackdrop = styled(Backdrop)(({ theme }) => ({
  zIndex: theme.zIndex.drawer + 1,
  color: '#fff',
}));

const LoadingIndicator: FC = (): ReactElement => {
  const loadingStatus = useSelector(loadingState);
  const dispatch = useDispatch();

  const showLoadingIndicator = loadingStatus === 'pending' ? true : false;

  const handleClose = () => {
    dispatch(resetToIdle());
  };

  return (
    <div>
      <StyledBackdrop open={showLoadingIndicator} onClick={handleClose}>
        <CircularProgress color="inherit" />
      </StyledBackdrop>
    </div>
  );
}

export default LoadingIndicator;
