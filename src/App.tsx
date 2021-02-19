import { Button } from '@material-ui/core';
import React from 'react';
import { useDispatch } from 'react-redux';
import LoadingIndicator from './features/loading/Loading';
import { setPending } from './features/loading/loadingSlice';
import Messagebar from './features/message/Messagebar';
import { showMessage } from './features/message/messageSlice';
import Routes from './routes';

const App = () => {

  const dispatch = useDispatch();
  const handleClick = () => dispatch(showMessage({status: "success", message: "hello"}));
  const handleLoadingClick = () => dispatch(setPending());

  return (
    <div>
      <Button onClick={() => handleClick()}>Message</Button>
      <Button onClick={() => handleLoadingClick()}>Loading</Button>
      <Routes/>
      <LoadingIndicator />
      <Messagebar />
    </div>
  );
}

export default App;
