import React, { FC, ReactElement, useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {  useSelector } from 'react-redux';
import { RouteComponentProps, useHistory } from "react-router-dom";

import { useAppDispatch } from '../../app/store';
import { Container, Fab } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import { activeTeam, Team } from '../team/teamSlice';
import NavBarBack from '../ui/NavBarBack';
import { Template, selectTemplates, selectTemplatesLoaded, initTeamTemplateListener, initGlobalTemplateListener, fetchTemplates } from './templateSlice';
import TemplateItem from './TemplateItem';
import NavBarSearch from '../ui/NavBarSearch';
import { Article, articles } from '../article/articleSlice';

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

type TemplateOverviewRouteProps = {
  shopId: string;
}

const TemplateOverview: FC<RouteComponentProps<TemplateOverviewRouteProps>> = ({match}): ReactElement => {
 
  const classes = useStyles();
  const allTemplates: Template[] = useSelector(selectTemplates);
  const allArticles: Article[] = useSelector(articles);
  const loaded: boolean = useSelector(selectTemplatesLoaded);
  const actTeam: Team | undefined = useSelector(activeTeam);
  const shopId = match.params.shopId;
  const dispatch = useAppDispatch();
  const history = useHistory();
  const [filterText, setFilterText] = useState('');

  useEffect(() => {

    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (!loaded && actTeam) {
        await dispatch(initGlobalTemplateListener());
        await dispatch(initTeamTemplateListener(actTeam!.id));
        await dispatch(fetchTemplates(actTeam!.id));
      }
    }

    fetchAndInit();    
  }, [loaded, actTeam, dispatch])

  const isPresent = (template: Template): boolean => {
    return allArticles.map(art => art.name).includes(template.name);
  }

  const handleAddClick = () => {
    history.push('shop/newShop');
  }

  const searchChange = (event: any) => {
    setFilterText(event.target.value);
  };
  
  return (
    <div>
      <NavBarSearch 
        title="" 
        onChange={searchChange} />
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {allTemplates
              .filter(template => template.name.includes(filterText))
              .map(template => 
                <Grid item xs={12} key={template.id}>
                  <TemplateItem 
                    template={template}
                    shopId={shopId}
                    presentInShop={isPresent(template)} />
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

export default TemplateOverview;
