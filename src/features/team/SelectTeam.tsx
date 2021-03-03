import { Button, Container, createStyles, Grid, IconButton, makeStyles, TextField, Theme } from "@material-ui/core";
import React, { FC, ReactElement, useState } from "react";
import NavBarBack from "../ui/NavBarBack";
import SendIcon from '@material-ui/icons/Send';

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

const SelectTeam: FC = (): ReactElement => {

    const classes = useStyles();
    const [teamName, setTeamName] = useState('')
    const [teamPassword, setTeamPassword] = useState('')

    const handleAddClick = () => {
        // dispatch(addShop(shopName));
    }

    const SendButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="send"
        disabled={teamName === '' || teamPassword === ''}
        onClick={handleAddClick}>
        <SendIcon />
      </IconButton>;

    return (
        <div>
            <NavBarBack title="Select team" childComp={<SendButton/>} />
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
                                    <TextField 
                                        id="standard-basic" 
                                        label="Enter team name ..."
                                        variant="outlined"
                                        fullWidth 
                                        value={teamName}
                                        onChange={event => setTeamName(event.target.value)}/>
                                </Grid>
                                <Grid item>
                                    <TextField 
                                        id="standard-basic" 
                                        label="Enter team password..."
                                        variant="outlined"
                                        type="password"
                                        fullWidth 
                                        value={teamPassword}
                                        onChange={event => setTeamPassword(event.target.value)}/>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
}

export default SelectTeam;