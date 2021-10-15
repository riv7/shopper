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
import { Article } from './articleSlice';
import { updateArticle } from './articleSlice';
import { useDispatch } from 'react-redux';
import NewArticle from './NewArticle';

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

type ArticleItemProps = {
    article: Article
}

const ArticleItem: FC<ArticleItemProps> = ({article}): ReactElement => {

  const classes = useStyles();
  const amountText = article.unit === '' ? article.amount : article.amount+' '+article.unit;

  const dispatch = useDispatch();

  var articleItem: Article = {...article};

  const handleIncreaseClick = (event:any) => {
    const newAmount = article.amount + 1;
    articleItem.amount = newAmount;
    dispatch(updateArticle(articleItem));
  };

  const handleDecreaseClick = (event:any) => {
    const newAmount = article.amount - 1;
    articleItem.amount = newAmount;
    dispatch(updateArticle(articleItem));
  };

  const handleResolvedClick = (event:any) => {
    articleItem.active = false;
    dispatch(updateArticle(articleItem));
  };

  return (
    <Card>
        <Grid container spacing={3}>
            <Grid item xs={1}>
                <CardActions>
                  <IconButton aria-label="resolve" onClick={handleResolvedClick}>
                      <CheckCircleOutlineRoundedIcon />
                   </IconButton>
                </CardActions>
            </Grid>
            <Grid item xs={5}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                    {article.name}
                    </Typography>
                </CardContent>
            </Grid>
            <Grid item xs={4}>
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                      <CardActions className={classes.decreaseButton}>
                        <IconButton aria-label="decreaseAmount" onClick={handleDecreaseClick}>
                            <IndeterminateCheckBoxIcon />
                        </IconButton>
                      </CardActions>
                    </Grid>
                    <Grid item xs={8}>
                      <CardContent>
                        <TextField disabled id="outlined-basic" variant="filled" inputProps={{min: 0, style: { textAlign: 'center' }}} value={amountText}/>
                      </CardContent>
                    </Grid>
                    <Grid item xs={2}>
                      <CardActions className={classes.increaseButton}>
                        <IconButton aria-label="increaseAmount" onClick={handleIncreaseClick}>
                            <AddBoxIcon />
                        </IconButton>
                      </CardActions>
                    </Grid>
                </Grid>
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
