import React from 'react';
import LoadingIndicator from './features/loading/Loading';
import Messagebar from './features/message/Messagebar';
import Routes from './routes';

const App = () => {

  return (
    <div>
      <Routes/>
      <LoadingIndicator />
      <Messagebar />
    </div>
  );
}

export default App;
