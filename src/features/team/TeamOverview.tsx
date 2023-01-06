import React, { FC, ReactElement, useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {  useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useAppDispatch } from '../../app/store';
import { Container, Fab, Typography } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import NavBarMenu from '../ui/NavBarMenu';
import { activeTeam, fetchTeams, Team, teamsOfUser, teamsOfUserLoaded } from '../team/teamSlice';
import TeamItem from './TeamItem';
import NavBarBack from '../ui/NavBarBack';
import NavigationIcon from '@material-ui/icons/Navigation';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '25px'
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    fab : {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    },
    fabInfo : {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 90,
      left: 'auto',
      position: 'fixed',
    },
    fabJoin : {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 90,
      left: 'auto',
      position: 'fixed'
    },
    fabCreate : {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 140,
      left: 'auto',
      position: 'fixed',
    },
    extendedIcon: {
      marginRight: theme.spacing(1),
    },
    extendedIcon2: {
      marginRight: theme.spacing(3),
    },
  }),
);

const TeamOverview: FC = (): ReactElement => {
 
  const classes = useStyles();
  const teamsLoaded: boolean = useSelector(teamsOfUserLoaded);
  const teams: Team[] = useSelector(teamsOfUser);
  const actTeam:  Team | undefined = useSelector(activeTeam);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [addSelected, setAddSelected] = useState(false);
  

  useEffect(() => {

    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
        if (!teamsLoaded) {
            await dispatch(fetchTeams())
        }
    }

    fetchAndInit();    
  }, [teamsLoaded, dispatch])

  const handleAddClick = () => {
    setAddSelected(!addSelected);
    // history.push('shop/newShop');
  }

  const handleCreateClick = () => {
    history.push('create');
  }

  const handleJoinClick = () => {
    history.push('join');
  }
  
  return (
    <div>
      <NavBarBack title="My shopping teams" />
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {teams && teams
              .map(team => 
                <Grid item xs={12} key={team.id}>
                  <TeamItem team={team} />
                </Grid>
              )}
          </Grid>
          <Fab className={classes.fab} color="secondary" aria-label="add" onClick={() => handleAddClick()}>
            <AddIcon />
          </Fab>
          {!addSelected && 
          <Typography variant="h6" className={classes.fabInfo}>
            Create/Join
          </Typography>}
          {addSelected && <Fab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
            className={classes.fabCreate}
            onClick={() => handleCreateClick()}
          >
            <NavigationIcon className={classes.extendedIcon} />
            Create
          </Fab>}
          {addSelected && <Fab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
            className={classes.fabJoin}
            onClick={() => handleJoinClick()}
          >
            <NavigationIcon className={classes.extendedIcon2} />
            Join
          </Fab>}
        </div>
      </Container>
    </div>
  );
}

export default TeamOverview;
