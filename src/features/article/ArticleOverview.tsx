import React, { FC, ReactElement, useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {  useSelector } from 'react-redux';
import { fetchArticles, Article, articles, articlesLoaded, initArticleListener, activateArticles, clearArticles, updateArticle } from './articleSlice';
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
import LabelPopup from '../label/LabelPopup';
import { Label, labelById } from '../label/labelSlice';
import NavBarMenu from '../ui/NavBarMenu';

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
  labelId: string;
}

const ArticleOverview: FC<RouteComponentProps<ArticleRouteProps>> = ({match}): ReactElement => {
 
  const classes = useStyles();
  const allArticles: Article[] = useSelector(articles);
  const labelId: string = match.params.labelId;
  const actTeam: Team | undefined = useSelector(activeTeam);
  const [labelSelectionOpened, setLabelSelectionOpened] = useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<Label>();
  const [selectedArticleLabel, setSelectedArticleLabel] = React.useState<Article>();
  const label: Label | undefined = useSelector(labelById(labelId));
  const labelFilterName = labelId === 'all' ? 'all' : label!.name

  // const labelSelectionState=  useState(false);
  const dispatch = useAppDispatch();
  const history = useHistory();

  useEffect(() => {

    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (actTeam) {
        await dispatch(initArticleListener(actTeam!.id));
        await dispatch(fetchArticles(actTeam!.id));
      }
    }

    fetchAndInit();    
  }, [actTeam, dispatch])

  const handleAddClick = () => {
    history.push(`/templates/${labelId}`);
  }

  const handleAddAll = () => {
    dispatch(activateArticles(labelId));
  }

  const handleClearAll = () => {
    dispatch(clearArticles(labelId));
  }

  const handleLabelSelectionClose = (label: Label) => {
    setLabelSelectionOpened(false);
    setSelectedLabel(label);
    const update: Article = {
      ...selectedArticleLabel!,
      labelId: label === undefined ? '' : label.id
    }
    dispatch(updateArticle(update));
  }

  const handleArticleLabelSelection = (article: Article) => {
    setSelectedArticleLabel(article);
    setLabelSelectionOpened(true)
  }

  const filteredArticles = (active: boolean) => allArticles
    .filter(article => (article.labelId === labelId || labelId === 'all') && (article.active === active));

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
                <Button fullWidth color="secondary" startIcon={<ExpandMoreIcon />} onClick={handleClearAll}> Clear all</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  return (
    <div>
      {/* <NavBarBack title={`shop or label: ${labelFilterName}`} /> */}
      <NavBarMenu/>
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {filteredArticles(true).map(article => 
              <Grid item xs={12} key={article.id}>
                <ArticleItem article={article} onLabelSelection={handleArticleLabelSelection} />
              </Grid>
            )}
            <ArticleDivider />
            {filteredArticles(false).map(article => 
              <Grid item xs={12} key={article.id}>
                <ArticleItem article={article} onLabelSelection={handleArticleLabelSelection} />
              </Grid>
            )}
          </Grid>
          <Fab className={classes.fab} color="secondary" aria-label="add" onClick={() => handleAddClick()}>
            <AddIcon />
          </Fab>
          <LabelPopup selectedLabel={selectedLabel!} open={labelSelectionOpened} onClose={handleLabelSelectionClose} />
        </div>
      </Container>
    </div>
  );
}

export default ArticleOverview;
