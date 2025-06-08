import React, { FC, ReactElement, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useAppDispatch } from '../../app/store';
import { Container } from '@mui/material';
import { activeTeam, Team } from '../team/teamSlice';
import { Template, selectTemplates, initTeamTemplateListener, initGlobalTemplateListener, fetchTemplates } from './templateSlice';
import TemplateItem from './TemplateItem';
import NavBarSearch from '../ui/NavBarSearch';
import { Article, articles } from '../article/articleSlice';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '25px'
}));

const StyledPaper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AddFab = styled('div')(({ theme }) => ({
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
}));

type TemplateOverviewRouteParams = {
  labelId: string;
}

const TemplateOverview: FC = (): ReactElement => {
  const allTemplates: Template[] = useSelector(selectTemplates);
  const allArticles: Article[] = useSelector(articles);
  const actTeam: Team | undefined = useSelector(activeTeam);
  const { labelId = 'all' } = useParams<TemplateOverviewRouteParams>();
  const dispatch = useAppDispatch();
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (actTeam) {
        await dispatch(initGlobalTemplateListener() as any);
        await dispatch(initTeamTemplateListener(actTeam!.id) as any);
        await dispatch(fetchTemplates(actTeam!.id) as any);
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
          <Grid sx={{ width: '100%' }} key={"new"}>
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
              <Grid sx={{ width: '100%' }} key={template.id}>
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
        <Root>
          <FilteredTemplates />
        </Root>
      </Container>
    </div>
  );
}

export default TemplateOverview;
