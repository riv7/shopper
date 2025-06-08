import { Box, Container, Divider, Grid, IconButton, ListItemIcon } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, ReactElement, useEffect } from "react";
import NavBarBack from "../ui/NavBarBack";
import SendIcon from '@mui/icons-material/Send';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import GroupIcon from '@mui/icons-material/Group';
import {activeTeam, fetchTeams, setTeamActive, Team, teamsOfUser, teamsOfUserLoaded} from './teamSlice';
import { useSelector } from "react-redux";
import { useAppDispatch } from "../../app/store";
import { useNavigate } from "react-router-dom";

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '50px'
}));

const StyledPaper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const StyledButton = styled('div')(({ theme }) => ({
  textAlign: 'center',
}));

const StyledListItem = styled(ListItem)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center'
}));

const SelectTeam2: FC = (): ReactElement => {
  const teamsLoaded: boolean = useSelector(teamsOfUserLoaded);
  const teams: Team[] = useSelector(teamsOfUser);
  const actTeam: Team | undefined = useSelector(activeTeam);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch async data
    const fetchAndInit = async () => {
      if (!teamsLoaded) {
        await dispatch(fetchTeams() as any);
      }
    }

    fetchAndInit();    
  }, [dispatch, teamsLoaded]);

  const handleAddClick = () => {
    // dispatch(addShop(shopName));
  }

  const handleTeamSelect = (index: number) => {
    dispatch(setTeamActive(teams[index]) as any);
    navigate('/');
  }

  const currentlyOn = (team: Team) => team.name === actTeam?.name ? " (x)" : "   ";

  const SendButton: FC = () =>
    <IconButton 
      color="secondary"
      aria-label="send"
      disabled={false}
      onClick={handleAddClick}>
      <SendIcon />
    </IconButton>;

  return (
    <div>
      <NavBarBack title="Select team" childComp={<SendButton/>} />
      <Container>
        <Root>
          <Grid container
            justifyContent="center"
            alignItems="flex-start"
            spacing={3}
            direction="row">

            <Grid sx={{ width: '100%' }}>
              <List component="nav">
                {teams.map((team, index) => 
                  <Box key={team.id}>
                    <ListItem component="button" onClick={() => handleTeamSelect(index)}>
                      <ListItemIcon>
                        <GroupIcon />
                      </ListItemIcon>
                      <ListItemText primary={team.name + currentlyOn(team)} />
                    </ListItem>                            
                    <Divider />
                  </Box>
                )}
              </List>
            </Grid>
          </Grid>
        </Root>
      </Container>
    </div>
  );
}

export default SelectTeam2;
