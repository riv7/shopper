import React, { FC, ReactElement, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { fetchArticles, Article, articles, initArticleListener, activateArticles, clearArticles, updateArticle } from './articleSlice';
import { useParams, useNavigate } from "react-router-dom";

import { useAppDispatch } from '../../app/store';
import { Button, Card, CardContent, Container, Divider, Fab, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { activeTeam, Team } from '../team/teamSlice';
import ArticleItem from './ArticleItem';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import LabelPopup from '../label/LabelPopup';
import { Label, labelById } from '../label/labelSlice';
import NavBarMenu from '../ui/NavBarMenu';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '25px'
}));

const ArticleDiv = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '25px',
  marginBottom: '25px'
}));

const StyledPaper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AddFab = styled(Fab)(({ theme }) => ({
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
}));

type ArticleRouteParams = {
  labelId: string;
}

const ArticleOverview: FC = (): ReactElement => {
  const allArticles: Article[] = useSelector(articles);
  const { labelId = 'all' } = useParams<ArticleRouteParams>();
  const actTeam: Team | undefined = useSelector(activeTeam);
  const [labelSelectionOpened, setLabelSelectionOpened] = useState(false);
  const [selectedLabel, setSelectedLabel] = React.useState<Label>();
  const [selectedArticleLabel, setSelectedArticleLabel] = React.useState<Article>();
  const label: Label | undefined = useSelector(labelById(labelId));
  const labelFilterName = labelId === 'all' ? 'all shops' : label?.name || ''
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch async data only when data is not yet loaded
    const fetchAndInit = async () => {
      if (actTeam) {
        await dispatch(initArticleListener(actTeam!.id) as any);
        await dispatch(fetchArticles(actTeam!.id) as any);
      }
    }
    fetchAndInit();    
  }, [actTeam, dispatch])

  const handleAddClick = () => {
    navigate(`/templates/${labelId}`);
  }

  const handleAddLabelClick = () => {
    navigate('../../label/add');
  }

  const handleAddAll = () => {
    dispatch(activateArticles(labelId) as any);
  }

  const handleClearAll = () => {
    dispatch(clearArticles(labelId) as any);
  }

  const handleLabelSelectionClose = (label: Label) => {
    setLabelSelectionOpened(false);
    setSelectedLabel(label);
    const update: Article = {
      ...selectedArticleLabel!,
      labelId: label === undefined ? '' : label.id
    }
    dispatch(updateArticle(update) as any);
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
        <Grid container spacing={5} sx={{ mt: 3, mb: 3 }}>
          <Grid sx={{ width: '100%' }} key="div1">
            <Grid container
              justifyContent="space-between"
              spacing={1}>
              <Grid sx={{ width: '100%' }}>
                <Divider variant="middle" />
              </Grid>
              <Grid sx={{ width: '25%' }}>
                <Button fullWidth color="secondary" startIcon={<ExpandLessIcon />} onClick={handleAddAll}>Add</Button>
              </Grid>
              <Grid sx={{ width: '50%' }}></Grid>
              <Grid sx={{ width: '25%' }}>
                <Button fullWidth color="secondary" endIcon={<ExpandMoreIcon />} onClick={handleClearAll}>Clear</Button>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  }

  return (
    <div>
      <NavBarMenu title={`${labelFilterName}`}/>
      <Container>
        <Root>
          <Grid container spacing={3}>
            {actTeam === undefined &&
              <Card sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Typography>Please create or select a team</Typography>
                </CardContent>
              </Card>
            }
            {allArticles.length === 0 &&
              <Card sx={{ flexGrow: 1 }}>
                <CardContent>
                  <Typography>Please add articles</Typography>
                </CardContent>
              </Card>
            }
            {filteredArticles(true).map(article => 
              <Grid sx={{ width: '100%' }} key={article.id}>
                <ArticleItem article={article} onLabelSelection={handleArticleLabelSelection} />
              </Grid>
            )}
            <ArticleDivider />
            {filteredArticles(false).map(article => 
              <Grid sx={{ width: '100%' }} key={article.id}>
                <ArticleItem article={article} onLabelSelection={handleArticleLabelSelection} />
              </Grid>
            )}
          </Grid>
          {actTeam && <AddFab color="secondary" aria-label="add" onClick={() => handleAddClick()}>
            <AddIcon />
          </AddFab>}
          <LabelPopup 
            selectedLabel={selectedLabel!}
            open={labelSelectionOpened}
            onClose={handleLabelSelectionClose}
            onAddLabel={handleAddLabelClick} />
        </Root>
      </Container>
    </div>
  );
}

export default ArticleOverview;
