import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }),
);


const NavBarNewShops: FC = () => {
  const classes = useStyles();
  const history = useHistory();

  const handleBackClick = () => {
    history.push('/');
  }

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton 
            edge="start" 
            className={classes.menuButton}
            color="inherit" aria-label="back"
            onClick={handleBackClick}>
              <ArrowBackIosIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            add new shop
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBarNewShops;