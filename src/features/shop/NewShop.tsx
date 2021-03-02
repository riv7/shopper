import { Container, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addShop } from './shopSlice';
import NavBarBack from '../ui/NavBarBack';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '50px'
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

    const SaveButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="save"
        disabled={shopName === ''}
        onClick={handleAddClick}>
        <SaveIcon />
      </IconButton>;

    return (
      <div>
        <NavBarBack title="Enter shop" childComp={<SaveButton/>} />
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
                <TextField 
                  id="standard-basic" 
                  label="Enter shop name ..."
                  variant="outlined"
                  fullWidth 
                  value={shopName}
                  onChange={event => setShopName(event.target.value)}/>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    );
};

export default NewShop;
