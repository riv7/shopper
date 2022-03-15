import React, { FC, ReactElement, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {  useSelector } from 'react-redux';
import { useHistory } from "react-router-dom";
import { useAppDispatch } from '../../app/store';
import { Container, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import NavBarMenu from '../ui/NavBarMenu';
import { activeTeam, fetchTeams, Team, teamsOfUser, teamsOfUserLoaded } from '../team/teamSlice';
import TeamItem from './TeamItem';

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
    }
  }),
);

const TeamOverview: FC = (): ReactElement => {
 
  const classes = useStyles();
  const teamsLoaded: boolean = useSelector(teamsOfUserLoaded);
  const teams: Team[] = useSelector(teamsOfUser);
  const actTeam:  Team | undefined = useSelector(activeTeam);
  const dispatch = useAppDispatch();
  const history = useHistory();
  

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
    history.push('shop/newShop');
  }
  
  return (
    <div>
      <NavBarMenu/>
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {teams
              .map(team => 
                <Grid item xs={12} key={team.id}>
                  <TeamItem team={team} />
                </Grid>
              )}
          </Grid>
          <Fab className={classes.fab} color="secondary" aria-label="add" onClick={() => handleAddClick()}>
            <AddIcon />
          </Fab>
        </div>
      </Container>
    </div>
  );
}

export default TeamOverview;
