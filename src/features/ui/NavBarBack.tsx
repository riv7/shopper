import React, { FC, ReactNode } from 'react';
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

type NavBarBackProps = {
  title: string,
  childComp?: ReactNode
  backPath?: string 
}


const NavBarBack: FC<NavBarBackProps> = ({title, childComp, backPath}) => {
  const classes = useStyles();
  const history = useHistory();

  const handleBackClick = () => {
    history.push(backPath ? backPath : '/');
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
            {title}
          </Typography>
          {childComp}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBarBack;