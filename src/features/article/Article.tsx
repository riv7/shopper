import React, { FC, ReactElement, useEffect } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import {  useSelector } from 'react-redux';
import { fetchCurrentArticles, Article, articles, articlesLoaded, initCurrentArticleListener } from './articleSlice';
import { RouteComponentProps, useHistory } from "react-router-dom";

import { useAppDispatch } from '../../app/store';
import { Container, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import NavBarMenu from '../ui/NavBarMenu';
import { activeTeam, Team } from '../team/teamSlice';
import ArticleItem from './ArticleItem';

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

type ArticleRouteProps = {
  shopId: string;
}

const Articles: FC<RouteComponentProps<ArticleRouteProps>> = ({match}): ReactElement => {
 
  const classes = useStyles();
  const allArticles: Article[] = useSelector(articles);
  const loaded: boolean = useSelector(articlesLoaded);
  const actTeam: Team | undefined = useSelector(activeTeam);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const shopId: string = match.params.shopId

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
    history.push(`newArticle/${shopId}`);
  }
  
  return (
    <div>
      <NavBarMenu/>
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {allArticles
              .filter(article => (article.shopId === shopId) && (article.active === true))
              .map(article => 
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

export default Articles;
