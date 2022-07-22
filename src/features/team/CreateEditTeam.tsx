import { Button, Card, CardActions, CardContent, Container, createStyles, FilledInput, Grid, IconButton, Input, InputAdornment, makeStyles, OutlinedInput, TextField, Theme, Typography } from "@material-ui/core";
import React, { FC, ReactElement, useState } from "react";
import NavBarBack from "../ui/NavBarBack";
import SaveIcon from '@material-ui/icons/Save';
import { addTeam, copyToClipboard, Team } from "./teamSlice";
import { useDispatch } from "react-redux";
import { AppAsyncThunk, useAppDispatch } from "../../app/store";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import InfoIcon from '@material-ui/icons/Info';
import { showMessage } from "../message/messageSlice";
import { OverridableComponent } from "@material-ui/core/OverridableComponent";
import { unwrapResult } from "@reduxjs/toolkit";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // root: {
        //   '& > *': {
        //     margin: theme.spacing(1),
        //   },
        // },
        root: {
            flexGrow: 1,
            marginTop: '50px'
        },
        button: {
            // margin: theme.spacing(2),
            // padding: theme.spacing(2),
            textAlign: 'center',
            //color: theme.palette.text.secondary,
        },
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

    const handleAddClick = async () => {
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

    const handleCopyClick = async () => {
        copyToClipboard(teamId, teamPassword);
        dispatch(showMessage({ status: "success", message: "Copy to clipboard successfull" }));
    }

    const displayMessage = () => dispatch(showMessage({status: "success", message: "Team saved"}));

    const SaveButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="save"
        disabled={teamName === '' || teamPassword === '' || credentialsChanged === false}
        onClick={handleAddClick}>
        <SaveIcon />
      </IconButton>;

    const InfoBox: FC = () =>
        <Card>
            <CardContent>
                {/* <Typography variant="h5" >
                    Team {teamName} created
                </Typography> */}
                <Typography variant="body1" >
                    <InfoIcon /> Copy and send credentials to a shopping friend
                </Typography>
            </CardContent>
            {/* <CardActions>
                <Button size="small">Copy</Button>
            </CardActions> */}
                   
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
                                    <Button 
                                        fullWidth
                                        variant="contained" 
                                        color="primary" 
                                        disabled={!teamPersistant}
                                        onClick={handleCopyClick}
                                        className={classes.button}>
                                        Copy to clipboard
                                    </Button>
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