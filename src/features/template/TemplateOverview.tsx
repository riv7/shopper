import React, { FC, ReactElement, useEffect, useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {  useSelector } from 'react-redux';
import { RouteComponentProps } from "react-router-dom";
import { useAppDispatch } from '../../app/store';
import { Container } from '@material-ui/core';
import { activeTeam, Team } from '../team/teamSlice';
import { Template, selectTemplates, initTeamTemplateListener, initGlobalTemplateListener, fetchTemplates } from './templateSlice';
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
  labelId: string;
}

const TemplateOverview: FC<RouteComponentProps<TemplateOverviewRouteProps>> = ({match}): ReactElement => {
 
  const classes = useStyles();
  const allTemplates: Template[] = useSelector(selectTemplates);
  const allArticles: Article[] = useSelector(articles);
  const actTeam: Team | undefined = useSelector(activeTeam);
  const labelId = match.params.labelId;
  const dispatch = useAppDispatch();
  const [filterText, setFilterText] = useState('');

  useEffect(() => {

    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (actTeam) {
        await dispatch(initGlobalTemplateListener());
        await dispatch(initTeamTemplateListener(actTeam!.id));
        await dispatch(fetchTemplates(actTeam!.id));
      }
    }
    fetchAndInit();    
  }, [actTeam, dispatch])

  const presentArticle = (template: Template): Article | undefined => {
    return allArticles
      .filter(article => (article.labelId === labelId || labelId === 'all'))
      .find(article => (article.name === template.name));
  }

  const searchChange = (event: any) => {
    setFilterText(event.target.value);
  };

  const emptyTemplate = (templateName: string): Template => ({
    id: '',
    name: templateName,
    unit: 'piece',
    global: false
  });

  const FilteredTemplates = () => {
    const filteredTemplates: Template[] = allTemplates.filter(template => template.name.includes(filterText));
    if (filteredTemplates.length === 0) {
      const tmpl = emptyTemplate(filterText);
      return (
        <Grid container spacing={3}>
          <Grid item xs={12} key={"new"}>
            <TemplateItem 
              template={tmpl}
              labelId={labelId}
              presentArticle={undefined} />
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid container spacing={3}>
          {filteredTemplates
            .map(template => 
              <Grid item xs={12} key={template.id}>
                <TemplateItem 
                  template={template}
                  labelId={labelId}
                  presentArticle={presentArticle(template)} />
              </Grid>
            )
          }
        </Grid>
      );
    }
  }

  return (
    <div>
      <NavBarSearch 
        title="Add articles" 
        onChange={searchChange} />
      <Container>
        <div className={classes.root}>
          <FilteredTemplates />
        </div>
      </Container>
    </div>
  );
}

export default TemplateOverview;
