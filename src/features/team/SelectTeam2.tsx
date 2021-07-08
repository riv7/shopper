import { Box, Button, Container, createStyles, Divider, Grid, IconButton, ListItemIcon, makeStyles, Paper, TextField, Theme } from "@material-ui/core";
import React, { FC, ReactElement, useEffect, useState } from "react";
import NavBarBack from "../ui/NavBarBack";
import SendIcon from '@material-ui/icons/Send';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import GroupIcon from '@material-ui/icons/Group';
import {activeTeam, fetchTeams, Team, teamsOfUser, teamsOfUserLoaded} from './teamSlice';
import { useDispatch, useSelector } from "react-redux";
import { useAppDispatch } from "../../app/store";
import { unwrapResult } from "@reduxjs/toolkit";
import { act } from "react-dom/test-utils";
import firebase from "firebase";

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
        paper: {
            padding: theme.spacing(2),
            textAlign: 'center',
            color: theme.palette.text.secondary,
        },
        button: {
            // margin: theme.spacing(2),
            // padding: theme.spacing(2),
            textAlign: 'center',
            //color: theme.palette.text.secondary,
        },
        listItem: {
            display:'flex',
            justifyContent:'center'
        }
    }),
);

const SelectTeam2: FC = (): ReactElement => {

    const classes = useStyles();
    // const [teams, setTeams] = useState<Team[]>([])
    const teamsLoaded: boolean = useSelector(teamsOfUserLoaded);
    const teams: Team[] = useSelector(teamsOfUser);
    const actTeam:  Team | undefined = useSelector(activeTeam);
    const dispatch = useAppDispatch();

    useEffect(() => {

        // Fetch async data
        const fetchAndInit = async () => {
            if (!teamsLoaded) {
                await dispatch(fetchTeams())
            }
        }

        fetchAndInit();    
    }, [dispatch, teamsLoaded])


    // TODO wgu: Example: Load without store
    // useEffect(() => {

    //     // Fetch async data
    //     const fetchAndInit = async () => {
    //         const resultAction = await dispatch(fetchTeams())
    //         const teams: Team[] = unwrapResult(resultAction)
    //         setTeams(teams);
    //     }

    //     fetchAndInit();    
    // }, [dispatch])

   

    const handleAddClick = () => {
        // dispatch(addShop(shopName));
    }

    const handleTeamSelect = (event:any) => {
        console.log(event)

    }


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
                <div className={classes.root}>
                    <Grid container
                        justify="center"
                        alignItems="flex-start"
                        spacing={3}
                        /*style={{ minHeight: '100vh' }}*/
                        direction="row">

                        <Grid item 
                            alignItems="center"
                            xs={12}>
                            <List component="nav" >
                                {teams.map(team => 
                                    <Box>
                                        <ListItem button>
                                            <ListItemIcon >
                                                <GroupIcon />
                                            </ListItemIcon>
                                            <ListItemText primary={team.name} />
                                            <ListItemText primary={team.ownerName} />
                                            <ListItemText primary={team.name === actTeam?.name ? "(currently on)" : ""} />
                                        </ListItem>                            
                                        <Divider />
                                    </Box>
                                )}
                            </List>
                        </Grid>

                        {/* {[1,2,3].map(shop => 
                        <Grid item xs={12} key={1} onClick={event => handleTeamSelect(event)}>
                            <Paper className={classes.paper}>{"hello"}</Paper>
                        </Grid>
                        )} 
                        */}
                    </Grid>
                </div>
            </Container>
        </div>
    );
}

export default SelectTeam2;