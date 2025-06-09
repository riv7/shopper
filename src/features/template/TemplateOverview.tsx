import React, { FC, ReactElement, useEffect, useState, useMemo, useCallback } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { useParams } from "react-router-dom";
import { useAppDispatch } from '../../app/store';
import { Container, CircularProgress } from '@mui/material';
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

// Memoized component for filtered templates
const MemoizedTemplateItem = React.memo(TemplateItem);

// Helper function to create an empty template
const createEmptyTemplate = (templateName: string): Template => ({
  id: '',
  name: templateName,
  unit: 'piece',
  global: false
});

// FilteredTemplates component moved outside the main component
const FilteredTemplates: FC<{
  templates: Template[],
  filterText: string,
  labelId: string,
  presentArticleFn: (template: Template) => Article | undefined
}> = React.memo(({ templates, filterText, labelId, presentArticleFn }) => {
  const filteredTemplates = useMemo(() => 
    templates.filter(template => template.name.includes(filterText)),
    [templates, filterText]
  );

  if (filteredTemplates.length === 0 && filterText) {
    const tmpl = createEmptyTemplate(filterText);
    return (
      <Grid container spacing={3}>
        <Grid sx={{ width: '100%' }} key={"new"}>
          <MemoizedTemplateItem 
            template={tmpl}
            labelId={labelId}
            presentArticle={undefined} />
        </Grid>
      </Grid>
    );
  } else {
    return (
      <Grid container spacing={3}>
        {filteredTemplates.map(template => 
          <Grid sx={{ width: '100%' }} key={template.id}>
            <MemoizedTemplateItem 
              template={template}
              labelId={labelId}
              presentArticle={presentArticleFn(template)} />
          </Grid>
        )}
      </Grid>
    );
  }
});

const TemplateOverview: FC = (): ReactElement => {
  const allTemplates: Template[] = useSelector(selectTemplates);
  const allArticles: Article[] = useSelector(articles);
  const actTeam: Team | undefined = useSelector(activeTeam);
  const { labelId = 'all' } = useParams<TemplateOverviewRouteParams>();
  const dispatch = useAppDispatch();
  const [filterText, setFilterText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Memoize filtered articles by label for better performance
  const filteredArticlesByLabel = useMemo(() => 
    allArticles.filter(article => (article.labelId === labelId || labelId === 'all')),
    [allArticles, labelId]
  );

  // Memoize the presentArticle function to avoid recreating it on every render
  const presentArticle = useCallback((template: Template): Article | undefined => {
    return filteredArticlesByLabel.find(article => (article.name === template.name));
  }, [filteredArticlesByLabel]);

  useEffect(() => {
    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (actTeam) {
        setIsLoading(true);
        try {
          // Use a single operation to fetch templates instead of multiple listeners + fetch
          await dispatch(fetchTemplates(actTeam.id) as any);
          
          // Set up listeners after initial fetch to catch updates
          dispatch(initGlobalTemplateListener() as any);
          dispatch(initTeamTemplateListener(actTeam.id) as any);
        } finally {
          setIsLoading(false);
        }
      }
    };
    fetchAndInit();    
  }, [actTeam, dispatch]);

  const searchChange = (event: any) => {
    setFilterText(event.target.value);
  };

  return (
    <div>
      <NavBarSearch 
        title="Add articles" 
        onChange={searchChange} />
      <Container>
        <Root>
          {isLoading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
              <CircularProgress />
            </div>
          ) : (
            <FilteredTemplates 
              templates={allTemplates}
              filterText={filterText}
              labelId={labelId}
              presentArticleFn={presentArticle}
            />
          )}
        </Root>
      </Container>
    </div>
  );
}

export default TemplateOverview;
