import React, { FC, ReactElement, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {  useSelector } from 'react-redux';
import { fetchShops, addShop, Shop, shops, shopsLoaded, initShopListener } from './shopSlice';

import { useAppDispatch } from '../../app/store';
import { Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '25px'
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    fab : {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    }
  }),
);

const Shops: FC = (): ReactElement => {
 
  const classes = useStyles();
  const allShops: Shop[] = useSelector(shops);
  const loaded: boolean = useSelector(shopsLoaded);
  const dispatch = useAppDispatch();

  useEffect(() => {

    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (!loaded) {
        await dispatch(initShopListener());
        const promise = await dispatch(fetchShops());
        console.log(promise);
      }
    }

    fetchAndInit();    
  }, [loaded, dispatch])

  const handleAddClick = () => dispatch(addShop());
  
  return (
    <div className={classes.root}>
      <Grid container spacing={3}>

        {allShops.map(shop => 
          <Grid item xs={12} key={shop.id}>
            <Paper className={classes.paper}>{shop.name}</Paper>
          </Grid>
        )}
        
      </Grid>
      <Fab className={classes.fab} color="secondary" aria-label="add" onClick={() => handleAddClick()}>
        <AddIcon />
      </Fab>
    </div>
  );
}

export default Shops;
