import React, { FC } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Menu, MenuItem } from '@material-ui/core';
import { AccountCircle, ExitToApp } from '@material-ui/icons';
import firebase from 'firebase';
import { activeTeam, Team } from '../team/teamSlice';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Sidedrawer from './Sidedrawer';

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

const NavBarMenu: FC = () => {

  const classes = useStyles();
  const history = useHistory();
  const actTeam: Team | undefined = useSelector(activeTeam);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const drawerOpenState = React.useState(false);
  const open = Boolean(anchorEl);

  const handleLogoutClick = () => {
    firebase.auth().signOut();
  }

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTeamClick = () => {
    history.push('team');
  };

  const handleSidedrawerClick = () => {
    drawerOpenState[1](true);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const teamName = () => actTeam ? actTeam.name : ''
  const owner = () => actTeam ? actTeam.ownerId === firebase.auth().currentUser!.uid ? ' (owner)' : '' : '';

  return (
    <div className={classes.root}>
      <Sidedrawer drawerOpenState={drawerOpenState} />
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} onClick={handleSidedrawerClick} color="inherit" aria-label="menu">
            <MenuIcon/>
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            shopping list
          </Typography>
          <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}>{firebase.auth().currentUser!.displayName}</MenuItem>
                <MenuItem onClick={handleTeamClick}>{teamName() + owner()}</MenuItem>
                <MenuItem onClick={handleLogoutClick}>
                  Logout
                  <IconButton
                    aria-label="logout"
                    color="inherit">
                    <ExitToApp />
                  </IconButton>
                </MenuItem>
              </Menu>
            </div>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBarMenu;