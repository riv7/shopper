import { Button, Container, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React, { FC, ReactElement } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import NavBarBack from "../ui/NavBarBack";
import CreateTeam from "./CreateTeam";

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

const SelectOrCreateTeam: FC = (): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();

    const handleCreateClick = () => {
        history.replace('team/create')
    }
    
    const handleSelectClick = () => {
        history.push('team/select')
    }

    return (
        <div>
            <NavBarBack title="Select or create team" />
            <Container>
                <div className={classes.root}>
                    <Grid
                        container
                        justify="center"
                        alignItems="flex-start"
                        spacing={0}
                        style={{ minHeight: '100vh' }}
                        direction="row">
                        <Grid item>
                            <Grid
                                container
                                justify="center"
                                direction="column"
                                spacing={3}>
                                <Grid item>
                                    <Button 
                                        variant="contained" 
                                        color="secondary" 
                                        onClick={handleSelectClick}
                                        className={classes.button}>
                                        Select team
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button 
                                        variant="contained"
                                        color="secondary"
                                        onClick={handleCreateClick}
                                        className={classes.button}>
                                        Create team
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

export default SelectOrCreateTeam;