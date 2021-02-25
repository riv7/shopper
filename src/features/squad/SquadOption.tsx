import { Button, Container, createStyles, Grid, makeStyles, Theme } from "@material-ui/core";
import React, { FC, ReactElement } from "react";
import NavBarBack from "../ui/NavBarBack";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        // root: {
        //   '& > *': {
        //     margin: theme.spacing(1),
        //   },
        // },
        root: {
            flexGrow: 1,
            marginTop: 30
        },
        button: {
            // margin: theme.spacing(2),
            // padding: theme.spacing(2),
            textAlign: 'center',
            //color: theme.palette.text.secondary,
        },
    }),
);

const SquadOption: FC = (): ReactElement => {

    const classes = useStyles();

    return (
        <div>
            <NavBarBack title="bla" />
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
                                    <Button variant="contained" color="secondary" className={classes.button}>Select squad</Button>
                                </Grid>
                                <Grid item>
                                    <Button variant="contained" color="secondary" className={classes.button}>Create squad</Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    );
}

export default SquadOption;