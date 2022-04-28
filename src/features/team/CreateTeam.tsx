import { Button, Card, CardActions, CardContent, Container, createStyles, FilledInput, Grid, IconButton, Input, InputAdornment, makeStyles, OutlinedInput, TextField, Theme, Typography } from "@material-ui/core";
import React, { FC, ReactElement, useState } from "react";
import NavBarBack from "../ui/NavBarBack";
import SaveIcon from '@material-ui/icons/Save';
import { addTeam, Team } from "./teamSlice";
import { useDispatch } from "react-redux";
import { useAppDispatch } from "../../app/store";
import { Visibility, VisibilityOff } from "@material-ui/icons";
import InfoIcon from '@material-ui/icons/Info';
import { showMessage } from "../message/messageSlice";

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

const CreateTeam: FC = (): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [teamName, setTeamName] = useState('')
    const [teamPassword, setTeamPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [teamAdded, setTeamAdded] = useState(false)

    const handleAddClick = () => {
        // const teamData: Team = {
        //     id: '',
        //     name: teamName,
        //     password: teamPassword,
        //     ownerId: '',
        //     ownerName: ''
        // }
        // dispatch(addTeam(teamData));
        setTeamAdded(true);
        displayMessage();
    }

    const handleShowPassword = () => {
        console.log(showPassword)
        setShowPassword(!showPassword);
    }

    const displayMessage = () => dispatch(showMessage({status: "success", message: "Team added"}));

    const SaveButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="save"
        disabled={teamName === '' || teamPassword === ''}
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
                    <InfoIcon /> Copy and send credentials to a shooping friend
                </Typography>
            </CardContent>
            {/* <CardActions>
                <Button size="small">Copy</Button>
            </CardActions> */}
                   
        </Card>
        

    return (
        <div>
            <NavBarBack title="Create team" childComp={<SaveButton/>} />
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
                                        onChange={event => setTeamName(event.target.value)}/>
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
                                <Grid item>
                                    <InfoBox />
                                </Grid>
                                <Grid item>
                                    <Button 
                                        fullWidth
                                        variant="contained" 
                                        color="secondary" 
                                        disabled={!teamAdded}
                                        // onClick={handleSelectClick}
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

export default CreateTeam;