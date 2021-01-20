import React, { FC, ReactElement, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import { useDispatch, useSelector } from 'react-redux';
import { fetchShops, Shop, shops, shopsLoaded } from './shopSlice';

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
  }),
);

const Shops: FC = (): ReactElement => {
 
  const classes = useStyles();
  const allShops: Shop[] = useSelector(shops);
  const loaded: boolean = useSelector(shopsLoaded);
  const dispatch = useDispatch();

  useEffect(() => {
    // Fetch async data only when data is not yet loaded
    if (!loaded) {
      dispatch(fetchShops(""));
    }
  }, [loaded, dispatch])

  return (
    <div className={classes.root}>
      <Grid container spacing={3}>

        {allShops.map(shop => 
          <Grid item xs={12} key={shop.id}>
            <Paper className={classes.paper}>{shop.name}</Paper>
          </Grid>
        )}
        
      </Grid>
    </div>
  );
}

export default Shops;
