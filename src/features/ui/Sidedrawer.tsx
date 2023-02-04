import React, { FC, SetStateAction, useEffect } from 'react';
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
import GroupIcon from '@material-ui/icons/Group';
import { fetchLabels, initLabelListener, Label, labels } from '../label/labelSlice';
import { useAppDispatch } from '../../app/store';
import LabelImportantIcon from '@material-ui/icons/LabelImportant';
import AddIcon from '@material-ui/icons/Add';
import WorkIcon from '@material-ui/icons/Work';


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
  const allLabels: Label[] = useSelector(labels);
  const dispatch = useAppDispatch();

  useEffect(() => {

    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (actTeam) {
        await dispatch(initLabelListener(actTeam!.id));
        await dispatch(fetchLabels(actTeam!.id));
      }
    }
    fetchAndInit();    
  }, [actTeam, dispatch])




  const handleTeamClick = () => {
    history.push('../../team/select2');
  };

  const handleLogoutClick = () => {
    firebase.auth().signOut();
  }

  const handleAddLabelClick = () => {
    history.push('../../label/add');
  }

  const handleManageLabelClick = () => {
    history.push(`../../label/manage`);
  }

  const handleSelectLabel = (labelId: string) => {
    history.push(`${labelId}`)
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
        <ListItem autoFocus button onClick={() => handleSelectLabel('all')}>
          <ListItemIcon>
              <LabelImportantIcon />
          </ListItemIcon>
          <ListItemText
            primary='all labels'
            // onClick={() => handleLabelClick(label)}
            // onDelete={handleDeleteChip} />
          />
        </ListItem>
        {allLabels.map((label) => (
          <ListItem autoFocus button onClick={() => handleSelectLabel(label.id)}>
            <ListItemIcon style = {{color: `${label.color}`}}>
                <LabelImportantIcon />
            </ListItemIcon>
            <ListItemText
              primary={label.name}
              // onClick={() => handleLabelClick(label)}
              // onDelete={handleDeleteChip} />
            />
          </ListItem>
        ))}
        <ListItem autoFocus button onClick={handleAddLabelClick}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add label" />
        </ListItem>
        <ListItem autoFocus button onClick={handleManageLabelClick}>
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Manage labels" />
        </ListItem>
      </List>
      
      <Divider />
      <List>
        <ListItem button onClick={handleTeamClick} key="team">
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary={"Change team"} />
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
