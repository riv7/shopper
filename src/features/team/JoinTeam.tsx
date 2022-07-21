import { Button, Card, CardActions, CardContent, Container, createStyles, FilledInput, Grid, IconButton, Input, InputAdornment, makeStyles, OutlinedInput, TextField, Theme, Typography } from "@material-ui/core";
import React, { FC, ReactElement, useState } from "react";
import NavBarBack from "../ui/NavBarBack";
import SaveIcon from '@material-ui/icons/Save';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import { addTeam, joinTeam, Team } from "./teamSlice";
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

const JoinTeam: FC = (): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [teamId, setTeamId] = useState('')
    const [teamPassword, setTeamPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [teamAdded, setTeamAdded] = useState(false)

    const handleJoinClick = async () => {
         const teamData: Team = {
             id: teamId,
             name: '',
             password: teamPassword,
             ownerId: '',
             ownerName: ''
        }
        await dispatch(joinTeam(teamData));
        setTeamAdded(true);
        displayMessage();
    }

    const handleShowPassword = () => {
        setShowPassword(!showPassword);
    }

   
    const displayMessage = () => dispatch(showMessage({status: "success", message: "Team joined"}));

    const JoinButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="save"
        disabled={teamId === '' || teamPassword === ''}
        onClick={handleJoinClick}>
        <ExitToAppIcon />
        {/* <SaveIcon /> */}
      </IconButton>;


    return (
        <div>
            <NavBarBack title="Join Team" childComp={<JoinButton/>} />
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
                                        label="Enter team id ..."
                                        variant="outlined"
                                        fullWidth 
                                        value={teamId}
                                        onChange={event => setTeamId(event.target.value)}/>
                                </Grid>
                                <Grid item>
                                    <OutlinedInput 
                                        id="standard-basic" 
                                        //label="Enter team password..."
                                        //variant="outlined"
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
                </div>
            </Container>
        </div>
    );
}

                                
export default JoinTeam;