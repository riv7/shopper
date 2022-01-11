import React, { FC, ReactElement, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {  useSelector } from 'react-redux';
import { fetchCurrentArticles, Article, articles, articlesLoaded, initCurrentArticleListener, activateArticles } from './articleSlice';
import { RouteComponentProps, useHistory } from "react-router-dom";

import { useAppDispatch } from '../../app/store';
import { Button, Container, Divider, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { activeTeam, Team } from '../team/teamSlice';
import ArticleItem from './ArticleItem';
import NavBarBack from '../ui/NavBarBack';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { Shop, shopById } from '../shop/shopSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '25px'
    },
    aricleDiv: {
      flexGrow: 1,
      marginTop: '25px',
      marginBottom: '25px'
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

type ArticleRouteProps = {
  shopId: string;
}

const ArticleOverview: FC<RouteComponentProps<ArticleRouteProps>> = ({match}): ReactElement => {
 
  const classes = useStyles();
  const allArticles: Article[] = useSelector(articles);
  const shopId: string = match.params.shopId
  const loaded: boolean = useSelector(articlesLoaded);
  const actTeam: Team | undefined = useSelector(activeTeam);
  const shop: Shop | undefined = useSelector(shopById(shopId));
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {

    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (!loaded && actTeam) {
        await dispatch(initCurrentArticleListener(actTeam!.id));
        await dispatch(fetchCurrentArticles(actTeam!.id));
      }
    }

    fetchAndInit();    
  }, [loaded, actTeam, dispatch])

  const handleAddClick = () => {
    history.push(`/templates/${shopId}`);
  }

  const handleAddAll = () => {
    dispatch(activateArticles(shop!));
  }

  const filteredArticles = (active: boolean) => allArticles
    .filter(article => (article.shopId === shopId) && (article.active === active));

  const ArticleDivider: FC = () => {
    if (filteredArticles(false).length === 0) {
      return <Grid />
    } else {
      return (
        <Grid container spacing={5} className={classes.aricleDiv}>
          <Grid item xs={12} key="div1">
            <Grid container
              justify="space-between"
              spacing={1}>
              <Grid item xs={12}>
                <Divider variant="middle" />
              </Grid>
              <Grid item xs={3}>
                <Button fullWidth color="secondary" startIcon={<ExpandLessIcon />} onClick={handleAddAll}>Add all</Button>
              </Grid>
              <Grid item xs={6}></Grid>
              <Grid item xs={3}>
                <Button fullWidth color="secondary" startIcon={<ExpandMoreIcon />}>Clear all</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  return (
    <div>
      <NavBarBack title={shop === undefined ? 'articles' : `${shop.name} articles`} />
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {filteredArticles(true).map(article => 
              <Grid item xs={12} key={article.id}>
                <ArticleItem article={article} />
              </Grid>
            )}
            <ArticleDivider />
            {filteredArticles(false).map(article => 
              <Grid item xs={12} key={article.id}>
                <ArticleItem article={article} />
              </Grid>
            )}
          </Grid>
          <Fab className={classes.fab} color="secondary" aria-label="add" onClick={() => handleAddClick()}>
            <AddIcon />
          </Fab>
        </div>
      </Container>
    </div>
  );
}

export default ArticleOverview;
