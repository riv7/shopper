import React, { FC, SetStateAction } from 'react';
import clsx from 'clsx';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';
import { Dispatch } from 'react';
import { Card, CardHeader } from '@material-ui/core';
import firebase from 'firebase';
import { activeTeam, Team } from '../team/teamSlice';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';



const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      width: 250,
    },
    fullList: {
      width: 'auto',
    },
    cardBackground: {
      background: theme.palette.secondary.dark
    }
  }),
);

type SidedrawerProps = {
  drawerOpenState: [boolean, Dispatch<SetStateAction<boolean>>]
}

const Sidedrawer:FC<SidedrawerProps> = ({drawerOpenState}) =>  {

  const classes = useStyles();
  const history = useHistory();
  const [drawerOpen, setDrawerOpen] = drawerOpenState;
  const actTeam: Team | undefined = useSelector(activeTeam);

  const teamName = () => actTeam ? actTeam.name : ''
  const owner = () => actTeam ? actTeam.ownerId === firebase.auth().currentUser!.uid ? ' (owner)' : '' : '';

  const handleTeamClick = () => {
    history.push('team');
  };

  const handleLogoutClick = () => {
    firebase.auth().signOut();
  }

  const toggleDrawer = (open: boolean) => (
    event: React.KeyboardEvent | React.MouseEvent,
  ) => {
    if (
      event.type === 'keydown' &&
      ((event as React.KeyboardEvent).key === 'Tab' ||
        (event as React.KeyboardEvent).key === 'Shift')
    ) {
      return;
    }

    setDrawerOpen(open);
  };

  const list = () => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: false,
      })}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <Card className={classes.cardBackground}>
        <CardHeader title="shopper"/>
      </Card>
      {/* <Typography>shopper</Typography> */}
      {/* <Divider /> */}
      <List>
        <ListItem key="user">
          <ListItemIcon><InboxIcon /></ListItemIcon>
          <ListItemText primary={firebase.auth().currentUser!.displayName} />
        </ListItem>
        <ListItem button onClick={handleLogoutClick} key="logout">
          <ListItemIcon><MailIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItem>
      </List>
      <Divider />
      <List>
        <ListItem button onClick={handleTeamClick} key="team">
          <ListItemIcon><MailIcon /></ListItemIcon>
          <ListItemText primary={teamName() + owner()} />
        </ListItem>
        {/* {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))} */}
      </List>
    </div>
  );

  return (
    <div>
        <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
        {list()}
        </Drawer>
    </div>
  );
}

export default Sidedrawer;
