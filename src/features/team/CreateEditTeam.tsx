import { Button, Card, CardContent, Container, createStyles, Grid, IconButton, InputAdornment, makeStyles, OutlinedInput, TextField, Theme, Typography } from "@material-ui/core";
import React, { FC, ReactElement, useState } from "react";
import NavBarBack from "../ui/NavBarBack";
import SaveIcon from '@material-ui/icons/Save';
import { copyToClipboard, Team } from "./teamSlice";
import { AppAsyncThunk, useAppDispatch } from "../../app/store";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import InfoIcon from '@material-ui/icons/Info';
import { showMessage } from "../message/messageSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import CopyToClipboard from "react-copy-to-clipboard";

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            flexGrow: 1,
            marginTop: '50px'
        },
        button: {
            textAlign: 'center',
        }
    }),
);

type CreateEditTeamProps = {
    title: string;
    team?: Team;
    thunkAction: AppAsyncThunk;
}

const CreateEditTeam: FC<CreateEditTeamProps> = ({title, team, thunkAction}): ReactElement => {

    const classes = useStyles();
    const dispatch = useAppDispatch();
    const [teamId, setTeamId] = useState(team === undefined ? '' : team.id);
    const [teamName, setTeamName] = useState(team === undefined ? '' : team.name);
    const [teamPassword, setTeamPassword] = useState(team === undefined ? '' : team.password);
    const [showPassword, setShowPassword] = useState(false);
    const [teamPersistant, setTeamPersistant] = useState(team === undefined ? false : true);
    const [credentialsChanged, setCredentialsChanged] = useState(false)

    const handleSaveClick = async () => {
        const teamData: Team = {
            id: teamId,
            name: teamName,
            password: teamPassword,
            ownerId: '',
            ownerName: ''
        }
        const asyncThunk = await dispatch(thunkAction(teamData));
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
                <div className={classes.root}>
                    <Grid
                        container
                        justify="center"
                        alignItems="flex-start"
                        spacing={0}
                        // style={{ minHeight: '100vh', width: "200px"} }
                        style={{ minHeight: '100vh' }}
                        direction="row">
                        <Grid item>
                            <Grid
                                container
                                justify="center"
                                direction="column"
                                spacing={3}>
                                <Grid item>
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
                                <Grid item>
                                    <OutlinedInput 
                                        id="standard-basic" 
                                        //label="Enter team password..."
                                        //variant="outlined"
                                        type={showPassword ? 'text' : 'password'}
                                        fullWidth 
                                        value={teamPassword}
                                        onChange={event => {
                                            setTeamPassword(event.target.value);
                                            setTeamPersistant(false);
                                            setCredentialsChanged(true)}}                                        endAdornment={
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
                                <Grid item>
                                    <InfoBox />
                                </Grid>
                                <Grid item>
                                    <CopyToClipboard text={copyText()}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            color="primary"
                                            disabled={!teamPersistant}
                                            onClick={handleDispatchMessage}
                                            className={classes.button}>
                                            Copy to clipboard
                                        </Button>
                                    </CopyToClipboard>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
}

export default CreateEditTeam;