import { Button, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import React, { FC, ReactElement } from 'react';
import { useDispatch } from 'react-redux';
import { addShop } from './shopSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '25px'
    }
  })
);

const NewShop: FC = (): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    
    const handleClick = () => {
        dispatch(addShop());
    }

    return (
        <div className={classes.root}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
                <TextField id="standard-basic" label="Standard" />
                <Button variant="contained" color="secondary" onClick={() => handleClick()}>
                    Add
                </Button>
            </Grid>
          </Grid>
        </div>
    );
};

export default NewShop;
