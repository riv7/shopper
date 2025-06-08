import React, { FC, ReactElement, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from '../../app/store';
import { Container, Fab, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import NavBarMenu from '../ui/NavBarMenu';
import { activeTeam, fetchTeams, Team, teamsOfUser, teamsOfUserLoaded } from '../team/teamSlice';
import TeamItem from './TeamItem';
import NavBarBack from '../ui/NavBarBack';
import NavigationIcon from '@mui/icons-material/Navigation';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '25px'
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AddFab = styled(Fab)(({ theme }) => ({
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
}));

const InfoTypography = styled(Typography)(({ theme }) => ({
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 90,
  left: 'auto',
  position: 'fixed',
}));

const JoinFab = styled(Fab)(({ theme }) => ({
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 90,
  left: 'auto',
  position: 'fixed',
}));

const CreateFab = styled(Fab)(({ theme }) => ({
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 140,
  left: 'auto',
  position: 'fixed',
}));

const ExtendedIcon = styled('span')(({ theme }) => ({
  marginRight: theme.spacing(1),
}));

const ExtendedIcon2 = styled('span')(({ theme }) => ({
  marginRight: theme.spacing(3),
}));

const TeamOverview: FC = (): ReactElement => {
  const teamsLoaded: boolean = useSelector(teamsOfUserLoaded);
  const teams: Team[] = useSelector(teamsOfUser);
  const actTeam: Team | undefined = useSelector(activeTeam);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [addSelected, setAddSelected] = useState(false);
  
  useEffect(() => {
    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
        if (!teamsLoaded) {
            await dispatch(fetchTeams() as any)
        }
    }

    fetchAndInit();    
  }, [teamsLoaded, dispatch])

  const handleAddClick = () => {
    setAddSelected(!addSelected);
    // history.push('shop/newShop');
  }

  const handleCreateClick = () => {
    navigate('create');
  }

  const handleJoinClick = () => {
    navigate('join');
  }
  
  return (
    <div>
      <NavBarBack title="My shopping teams" />
      <Container>
        <Root>
          <Grid container spacing={3}>
            {teams && teams
              .map(team => 
                <Grid sx={{ width: '100%' }} key={team.id}>
                  <TeamItem team={team} />
                </Grid>
              )}
          </Grid>
          <AddFab color="secondary" aria-label="add" onClick={() => handleAddClick()}>
            <AddIcon />
          </AddFab>
          {!addSelected && 
          <InfoTypography variant="h6">
            Create/Join
          </InfoTypography>}
          {addSelected && <CreateFab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
            onClick={() => handleCreateClick()}
          >
            <NavigationIcon sx={{ mr: 1 }} />
            Create
          </CreateFab>}
          {addSelected && <JoinFab
            variant="extended"
            size="medium"
            color="primary"
            aria-label="add"
            onClick={() => handleJoinClick()}
          >
            <NavigationIcon sx={{ mr: 3 }} />
            Join
          </JoinFab>}
        </Root>
      </Container>
    </div>
  );
}

export default TeamOverview;
