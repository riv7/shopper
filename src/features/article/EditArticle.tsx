import { Container, Grid, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBarBack from '../ui/NavBarBack';
import { useParams, useNavigate } from 'react-router-dom';
import { Article, articleById, updateArticle } from './articleSlice';
import SelectUnit from '../ui/SelectUnit';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '50px'
}));

const TextInput = styled(TextField)(({ theme }) => ({
  marginLeft: '5px'
}));

type EditArticleRouteParams = {
  articleId: string;
}

const EditArticle: FC = (): ReactElement => {
    const dispatch = useDispatch();
    const { articleId = '' } = useParams<EditArticleRouteParams>();
    const article: Article | undefined = useSelector(articleById(articleId));
    const navigate = useNavigate();
    const [articleName, setArticleName] = useState(article === undefined ? '' : article.name);
    const [articleAmount, setArticleAmount] = useState(article === undefined ? 0 : article.amount);
    const unitState = useState(article === undefined ? '' : article.unit);
    const [selectedUnit] = unitState;
    const valueChangedState = useState(false);
    const [valueChanged, setValueChanged] = valueChangedState;

    const handleSaveClick = () => {
      const changedArticle = {
        id: article!.id,
        name: articleName,
        amount: articleAmount,
        unit: selectedUnit,
        active: article!.active,
        labelId: article!.labelId
      }
      dispatch(updateArticle(changedArticle) as any);
      navigate(-1);
    }

    const SaveButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="save"
        disabled={valueChanged === false}
        onClick={handleSaveClick}>
        <SaveIcon />
      </IconButton>;

    return (
      <div>
        <NavBarBack 
          title="Edit article"
          childComp={<SaveButton/>} />
        <Container>
          <form>
            <Root>
              <Grid
                container
                justifyContent="center"
                alignItems="flex-start"
                spacing={0}
                style={{ minHeight: '100vh' }}
                direction="row">

                <Grid
                  container
                  justifyContent="center"
                  direction="column"
                  spacing={3}>
                  <Grid>
                    <TextField 
                      id="article-name" 
                      label="Change article name..."
                      variant="outlined"
                      fullWidth 
                      value={articleName}
                      onChange={event => {
                        setArticleName(event.target.value);
                        setValueChanged(true)}}/>
                  </Grid>
                  <Grid>
                    <Grid
                      container
                      justifyContent="space-between"
                      spacing={1}>
                        <Grid sx={{ width: '66.67%' }}>
                          <TextField 
                            id="article-amount" 
                            label="Enter article amount ..."
                            variant="outlined"
                            fullWidth 
                            value={articleAmount}
                            onChange={event => {
                              setArticleAmount(Number(event.target.value));
                              setValueChanged(true)}}/>
                        </Grid>
                        <Grid sx={{ width: '33.33%' }}>
                          <SelectUnit unitState={unitState} valueChangedState={valueChangedState} />
                        </Grid>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Root>
          </form>
        </Container>
      </div>
    );
};

export default EditArticle;
