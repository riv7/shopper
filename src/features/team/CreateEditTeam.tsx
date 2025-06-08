import { Button, Card, CardContent, Container, Grid, IconButton, InputAdornment, OutlinedInput, TextField, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, ReactElement, useState } from "react";
import NavBarBack from "../ui/NavBarBack";
import SaveIcon from '@mui/icons-material/Save';
import { copyToClipboard, Team } from "./teamSlice";
import { AppAsyncThunk, useAppDispatch } from "../../app/store";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import InfoIcon from '@mui/icons-material/Info';
import { showMessage } from "../message/messageSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import CopyToClipboard from "react-copy-to-clipboard";

const Root = styled('div')(() => ({
  flexGrow: 1,
  marginTop: '50px'
}));

const StyledButton = styled(Button)(() => ({
  textAlign: 'center',
}));

type CreateEditTeamProps = {
  title: string;
  team?: Team;
  thunkAction: AppAsyncThunk;
}

const CreateEditTeam: FC<CreateEditTeamProps> = ({title, team, thunkAction}): ReactElement => {
  const dispatch = useAppDispatch();
  const [teamId, setTeamId] = useState(team === undefined ? '' : team.id);
  const [teamName, setTeamName] = useState(team === undefined ? '' : team.name);
  const [teamPassword, setTeamPassword] = useState(team === undefined ? '' : team.password);
  const [showPassword, setShowPassword] = useState(false);
  const [teamPersistant, setTeamPersistant] = useState(team === undefined ? false : true);
  const [credentialsChanged, setCredentialsChanged] = useState(false);

  const handleSaveClick = async () => {
    const teamData: Team = {
      id: teamId,
      name: teamName,
      password: teamPassword,
      ownerId: '',
      ownerName: ''
    }
    const asyncThunk = await dispatch(thunkAction(teamData) as any);
    const persistentTeam: Team = unwrapResult(asyncThunk);

    setTeamPersistant(true);
    setTeamId(persistentTeam.id);
    setCredentialsChanged(false);
    displayMessage();
  }

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const copyText = () =>  `You have been invited to use the shopper app. Please visit https://shopper.zapto.org/team/join on your PC or mobile phone.\n\nPaste the following credentials in the join team dialog.\n\nTeam ID: ${teamId} | Team PW: ${teamPassword}\n\nHappy shopping!`

  const handleDispatchMessage = () => {
    dispatch(showMessage({ status: "success", message: "Copy to clipboard successfull.\nPlease send them to your shopping mate to join." }));
  }

  const displayMessage = () => dispatch(showMessage({status: "success", message: "Team saved"}));

  const SaveButton: FC = () =>
    <IconButton 
      color="secondary"
      aria-label="save"
      disabled={teamName === '' || teamPassword === '' || credentialsChanged === false}
      onClick={handleSaveClick}>
      <SaveIcon />
    </IconButton>;

  const InfoBox: FC = () =>
    <Card>
      <CardContent>
        <Typography variant="body1" >
          <InfoIcon /> Copy and send credentials to a shopping friend
        </Typography>
      </CardContent>
    </Card>

  return (
    <div>
      <NavBarBack title={title} childComp={<SaveButton/>} />
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
                    label="Enter team name ..."
                    variant="outlined"
                    fullWidth 
                    value={teamName}
                    onChange={event => {
                      setTeamName(event.target.value);
                      setTeamPersistant(false);
                      setCredentialsChanged(true)}}/>
                </Grid>
                <Grid>
                  <OutlinedInput 
                    id="standard-basic" 
                    type={showPassword ? 'text' : 'password'}
                    fullWidth 
                    value={teamPassword}
                    onChange={event => {
                      setTeamPassword(event.target.value);
                      setTeamPersistant(false);
                      setCredentialsChanged(true)}}                                        
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
                <Grid>
                  <InfoBox />
                </Grid>
                <Grid>
                  <CopyToClipboard text={copyText()}>
                    <Button
                      fullWidth
                      variant="contained"
                      color="primary"
                      disabled={!teamPersistant}
                      onClick={handleDispatchMessage}
                      sx={{ textAlign: 'center' }}>
                      Copy to clipboard
                    </Button>
                  </CopyToClipboard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Root>
      </Container>
    </div>
  );
}

export default CreateEditTeam;
