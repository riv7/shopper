import { Container, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBarBack from '../ui/NavBarBack';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Article, articleById, updateArticle } from './articleSlice';
import SelectUnit from '../ui/SelectUnit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '50px'
    },
    textInput: {
      marginLeft: '5px'
    }
  })
);

type EditArticleRouteProps = {
  articleId: string;
}

const EditArticle: FC<RouteComponentProps<EditArticleRouteProps>> = ({match}): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();

    const articleId: string = match.params.articleId;
    const article: Article | undefined = useSelector(articleById(articleId));

    const history = useHistory();
    
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
      dispatch(updateArticle(changedArticle));
      history.goBack();
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
            <div className={classes.root}>
              <Grid
                container
                justify="center"
                alignItems="flex-start"
                spacing={0}
                style={{ minHeight: '100vh' }}
                direction="row">

                <Grid
                  container
                  justify="center"
                  direction="column"
                  spacing={3}>
                  <Grid item>
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
                  <Grid item>
                    <Grid
                      container
                      justify="space-between"
                      spacing={1}>
                        <Grid item xs={8}>
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
                        <Grid item xs={4}>
                          <SelectUnit unitState={unitState} valueChangedState={valueChangedState} />
                        </Grid>
                      </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </form>
        </Container>
      </div>
    );
};

export default EditArticle;
