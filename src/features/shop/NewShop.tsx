import { Container, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addShop } from './shopSlice';
import NavBarNewShops from './NavBarNewShops';

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
    const [shopName, setShopName] = useState('');
    
    const handleAddClick = () => {
        dispatch(addShop(shopName));
    }

    return (
      <div>
        <NavBarNewShops />
        <Container>
          <div className={classes.root}>
            <Grid container spacing={3}>
              
              <Grid item xs={12}>
                <Grid container justify="space-between" spacing={3}>
                  <Grid item>
                    <TextField 
                      id="standard-basic" 
                      label="Enter shop name ..."
                      fullWidth 
                      value={shopName}
                      onChange={event => setShopName(event.target.value)}/>
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
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    );
};

export default NewShop;
