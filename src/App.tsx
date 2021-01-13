import { Container, CssBaseline } from '@material-ui/core';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import React from 'react';
import NavBar from './features/ui/NavBar';
import Routes from './routes';


const theme = createMuiTheme({
  palette: {
    type: 'dark'
  }
});

const App = () => {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <NavBar />
        <Container>
          <Routes/>
        </Container>
      </ThemeProvider>
    </div>
  );
}

export default App;
