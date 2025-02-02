import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { activeTeam, Team } from '../team/teamSlice';
import { useSelector } from 'react-redux';
import Sidedrawer from './Sidedrawer';
import { getAuth } from "firebase/auth";

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

type NavBarMenuProps = {
  title: string
}

const NavBarMenu: FC<NavBarMenuProps> = ({title}) => {

  const classes = useStyles();
  const actTeam: Team | undefined = useSelector(activeTeam);
  const drawerOpenState = React.useState(false);

  const handleSidedrawerClick = () => {
    drawerOpenState[1](true);
  };

  const teamName = () => actTeam ? actTeam.name : ''

  return (
    <div className={classes.root}>
      <Sidedrawer drawerOpenState={drawerOpenState} />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} onClick={handleSidedrawerClick} color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <div>
            <Typography className={classes.title}>
              {getAuth().currentUser!.displayName +" | "+ teamName()}
            </Typography>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBarMenu;