import React, { FC, ReactElement, useState } from 'react';
import { makeStyles, createStyles, Theme, alpha } from '@material-ui/core/styles';
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
import { Button, Input, TextField } from '@material-ui/core';
import { Article } from './articleSlice';
import { updateArticle } from './articleSlice';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

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
    typography: {
      color: alpha(theme.palette.common.white, 0.75)
    },
    typographyLight: {
      color: alpha(theme.palette.common.white, 0.25)
    },
  }),
);

type ArticleItemProps = {
    article: Article
}

const ArticleItem: FC<ArticleItemProps> = ({article}): ReactElement => {

  const classes = useStyles();
  const history = useHistory();
  const amountText = article.unit === '' ? article.amount : article.amount+' '+article.unit;
  const typoClass = article.active === false ? classes.typographyLight : classes.typography;

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
    articleItem.active = !articleItem.active;
    dispatch(updateArticle(articleItem));
  };

  const handleEdit = () => {
    history.push(`editArticle/${article.id}`);
  }

  return (
    <Card>
        <Grid container spacing={3}>
            <Grid item xs={1}>
                <CardActions>
                  <IconButton className={typoClass} aria-label="resolve" onClick={handleResolvedClick}>
                      <CheckCircleOutlineRoundedIcon />
                   </IconButton>
                </CardActions>
            </Grid>
            <Grid item xs={3} md={5}>
                <CardContent>
                    <Typography className={typoClass} variant="h5" component="h2">
                    {article.name}
                    </Typography>
                </CardContent>
            </Grid>
            <Grid item xs={6} md={4}>
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                      <CardActions className={classes.decreaseButton}>
                        <IconButton className={typoClass} aria-label="decreaseAmount" onClick={handleDecreaseClick}>
                            <IndeterminateCheckBoxIcon />
                        </IconButton>
                      </CardActions>
                    </Grid>
                    <Grid item xs={8}>
                      <CardContent>
                        <Button variant="outlined" fullWidth onClick={handleEdit}>{amountText}</Button>
                      </CardContent>
                    </Grid>
                    <Grid item xs={2}>
                      <CardActions className={classes.increaseButton}>
                        <IconButton className={typoClass} aria-label="increaseAmount" onClick={handleIncreaseClick}>
                            <AddBoxIcon />
                        </IconButton>
                      </CardActions>
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={2}>
                <CardActions className={classes.menuButton}>
                  <IconButton className={typoClass} aria-label="menu">
                      <MenuIcon />
                  </IconButton>
                </CardActions>
            </Grid>
        </Grid>
    </Card>
  );
}

export default ArticleItem;
