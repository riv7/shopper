import React, { FC, ReactElement, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { TextField } from '@material-ui/core';
import { Shop } from './shopSlice';
import { updateArticle } from './shopSlice';
import { useDispatch } from 'react-redux';
import NewArticle from './NewShop';
import ShopIcon from '@material-ui/icons/Shop';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    menuButton: {
      justifyContent:'right'
    },
    increaseButton: {
      justifyContent:'right'
    },
    decreaseButton: {
      justifyContent:'left'
    },
    title: {
      flexGrow: 1,
    },
  }),
);

type ShopItemProps = {
    shop: Shop
}

const ArticleItem: FC<ShopItemProps> = ({shop}): ReactElement => {

  const classes = useStyles();
  const dispatch = useDispatch();
  
  
  // const amountText = article.unit === '' ? article.amount : article.amount+' '+article.unit;

  // var articleItem: Shop = {...article};

  // const handleIncreaseClick = (event:any) => {
  //   const newAmount = article.amount + 1;
  //   articleItem.amount = newAmount;
  //   dispatch(updateArticle(articleItem));
  // };

  // const handleDecreaseClick = (event:any) => {
  //   const newAmount = article.amount - 1;
  //   articleItem.amount = newAmount;
  //   dispatch(updateArticle(articleItem));
  // };

  // const handleResolvedClick = (event:any) => {
  //   articleItem.active = false;
  //   dispatch(updateArticle(articleItem));
  // };

  return (
    <Card>
        <Grid container spacing={3}>
            <Grid item xs={1}>
                <CardActions>
                  <IconButton aria-label="shop">
                      <ShopIcon />
                   </IconButton>
                </CardActions>
            </Grid>
            <Grid item xs={9}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                    {shop.name}
                    </Typography>
                </CardContent>
            </Grid>
            <Grid item xs={2}>
                <CardActions className={classes.menuButton}>
                  <IconButton aria-label="menu">
                      <MenuIcon />
                  </IconButton>
                </CardActions>
            </Grid>
        </Grid>
    </Card>
  );
}

export default ArticleItem;
