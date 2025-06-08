import React, { FC, SetStateAction, useEffect } from 'react';
import clsx from 'clsx';
import { styled, Theme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import { alpha } from '@mui/material/styles';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import { Dispatch } from 'react';
import { Card, CardHeader } from '@mui/material';
import { activeTeam, Team } from '../team/teamSlice';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import GroupIcon from '@mui/icons-material/Group';
import { fetchLabels, initLabelListener, Label, labels } from '../label/labelSlice';
import { useAppDispatch } from '../../app/store';
import { executeThunk } from '../../app/thunkUtils';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import AddIcon from '@mui/icons-material/Add';
import WorkIcon from '@mui/icons-material/Work';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import { getAuth } from "firebase/auth";

const StyledList = styled('div')(({ theme }) => ({
  width: 250,
}));

const StyledFullList = styled('div')(({ theme }) => ({
  width: 'auto',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: theme.palette.secondary.dark
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    borderRadius: '4px',
    transition: 'background-color 0.3s ease'
  }
}));

type SidedrawerProps = {
  drawerOpenState: [boolean, Dispatch<SetStateAction<boolean>>]
}

const Sidedrawer:FC<SidedrawerProps> = ({drawerOpenState}) =>  {

  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = drawerOpenState;
  const actTeam: Team | undefined = useSelector(activeTeam);
  const allLabels: Label[] = useSelector(labels);
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (actTeam) {
        // Use executeThunk instead of dispatch
        await executeThunk(initLabelListener(actTeam!.id), dispatch, () => ({}));
        await executeThunk(fetchLabels(actTeam!.id), dispatch, () => ({}));
      }
    }
    fetchAndInit();    
  }, [actTeam, dispatch])

  const handleTeamClick = () => {
    navigate('/team/select2');
  };

  const handleLogoutClick = () => {
    getAuth().signOut();
  }

  const handleAddLabelClick = () => {
    navigate('/label/add');
  }

  const handleManageLabelClick = () => {
    navigate(`/label/manage`);
  }

  const handleSelectLabel = (labelId: string) => {
    navigate(`/articles/labels/${labelId}`)
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
    <StyledList
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <StyledCard>
        <CardHeader title="shopper"/>
      </StyledCard>
      <List>
        <ListItem key="user">
          <ListItemIcon><AccountBoxIcon /></ListItemIcon>
          <ListItemText primary={getAuth().currentUser!.displayName} />
        </ListItem>
        <StyledListItem onClick={handleLogoutClick} key="logout">
          <ListItemIcon><InboxIcon /></ListItemIcon>
          <ListItemText primary="Logout" />
        </StyledListItem>
      </List>
      <Divider />
      <List>
        <StyledListItem autoFocus onClick={() => handleSelectLabel('all')}>
          <ListItemIcon>
              <LabelImportantIcon />
          </ListItemIcon>
          <ListItemText
            primary='all shops'
          />
        </StyledListItem>
        {allLabels.map((label) => (
          <StyledListItem autoFocus onClick={() => handleSelectLabel(label.id)}>
            <ListItemIcon style = {{color: `${label.color}`}}>
                <LabelImportantIcon />
            </ListItemIcon>
            <ListItemText
              primary={label.name}
            />
          </StyledListItem>
        ))}
        {actTeam && <StyledListItem autoFocus onClick={handleAddLabelClick}>
          <ListItemIcon>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add shop" />
        </StyledListItem>}
        {actTeam && <StyledListItem autoFocus onClick={handleManageLabelClick}>
          <ListItemIcon>
            <WorkIcon />
          </ListItemIcon>
          <ListItemText primary="Manage shops" />
        </StyledListItem>}
      </List>
      
      <Divider />
      <List>
        <StyledListItem onClick={handleTeamClick} key="team">
          <ListItemIcon><GroupIcon /></ListItemIcon>
          <ListItemText primary={"Change team"} />
        </StyledListItem>
      </List>
    </StyledList>
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
