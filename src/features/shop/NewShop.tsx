import { createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useHistory } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { addShop } from './shopSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '25px'
    },
    textInput: {
      marginLeft: '5px'
    }
  })
);

const NewShop: FC = (): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [shopName, setShopName] = useState('');
    
    const handleAddClick = () => {
        dispatch(addShop(shopName));
    }

    const handleCancelClick = () => {
      history.push('/');
  }

    return (
        <div className={classes.root}>
          <Grid container spacing={3}>
            
            <Grid item xs={12}>
              <Grid container justify="space-between" spacing={3}>
                <Grid item>
                  <IconButton 
                    color="secondary"
                    aria-label="cancel"
                    onClick={handleCancelClick}>
                    <CloseIcon />
                  </IconButton>
                </Grid>
                <Grid item>
                  <IconButton 
                    color="secondary"
                    aria-label="save"
                    disabled={shopName === ''}
                    onClick={handleAddClick}>
                    <SaveIcon />
                  </IconButton>
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <Grid container className={classes.textInput} spacing={3}>
                  <Grid item>
                    <TextField 
                      id="standard-basic" 
                      label="Enter shop name ..."
                      fullWidth 
                      value={shopName}
                      onChange={event => setShopName(event.target.value)}/>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
    );
};

export default NewShop;
