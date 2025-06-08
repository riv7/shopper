import { Container, Grid, IconButton, InputAdornment, OutlinedInput, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, ReactElement, useState } from "react";
import NavBarBack from "../ui/NavBarBack";
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { joinTeam, Team } from "./teamSlice";
import { useAppDispatch } from "../../app/store";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { showMessage } from "../message/messageSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const Root = styled('div')(() => ({
  flexGrow: 1,
  marginTop: '50px'
}));

const StyledButton = styled('div')(() => ({
  textAlign: 'center',
}));

const JoinTeam: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const [teamId, setTeamId] = useState('');
  const [teamPassword, setTeamPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleJoinClick = async () => {
    const teamData: Team = {
      id: teamId,
      name: '',
      password: teamPassword,
      ownerId: '',
      ownerName: ''
    }
    const asyncThunk = await dispatch(joinTeam(teamData) as any);
    const loadedTeam: Team = unwrapResult(asyncThunk);
    loadedTeam.id === '' ? displayNotFoundMessage() : displaySuccessMessage();
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }
   
  const displaySuccessMessage = () => dispatch(showMessage({status: "success", message: "Team joined"}));
  const displayNotFoundMessage = () => dispatch(showMessage({status: "error", message: "No team found with given credentials"}));

  const JoinButton: FC = () =>
    <IconButton 
      color="secondary"
      aria-label="save"
      disabled={teamId === '' || teamPassword === ''}
      onClick={handleJoinClick}>
      <ExitToAppIcon />
    </IconButton>;

  return (
    <div>
      <NavBarBack title="Join Team" childComp={<JoinButton/>} />
      <Container>
        <Root>
          <Grid
            container
            justifyContent="center"
            alignItems="flex-start"
            spacing={0}
            style={{ minHeight: '100vh' }}
            direction="row">
            <Grid>
              <Grid
                container
                justifyContent="center"
                direction="column"
                spacing={3}>
                <Grid>
                  <TextField 
                    id="standard-basic" 
                    label="Enter team id ..."
                    variant="outlined"
                    fullWidth 
                    value={teamId}
                    onChange={event => setTeamId(event.target.value)}/>
                </Grid>
                <Grid>
                  <OutlinedInput 
                    id="standard-basic" 
                    type={showPassword ? 'text' : 'password'}
                    fullWidth 
                    value={teamPassword}
                    onChange={event => setTeamPassword(event.target.value)}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleShowPassword}
                        >
                          {showPassword ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                      </InputAdornment>
                    }/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Root>
      </Container>
    </div>
  );
}

export default JoinTeam;
