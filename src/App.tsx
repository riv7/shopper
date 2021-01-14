import { Button, Container, CssBaseline } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import { useDispatch } from 'react-redux';
import Messagebar from './features/message/Messagebar';
import { showMessage } from './features/message/messageSlice';
import NavBar from './features/ui/NavBar';
import Routes from './routes';


const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

const App = () => {

  const dispatch = useDispatch();
  const handleClick = () => dispatch(showMessage({status: "success", message: "hello"}));

  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Button onClick={() => handleClick()}>Test</Button>
        <NavBar />
        <Container>
          <Routes/>
        </Container>
        <Messagebar />
      </ThemeProvider>
    </div>
  );
}

export default App;
