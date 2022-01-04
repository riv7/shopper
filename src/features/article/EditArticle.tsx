import { Container, createStyles, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBarBack from '../ui/NavBarBack';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Article, articleById, updateArticle } from './articleSlice';

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
    const [articleUnit, setArticleUnit] = useState('');
    const [articleAmount, setArticleAmount] = useState(0);
    const [valueChanged, setValueChanged] = useState(false);

    const handleSaveClick = () => {
      const changedArticle = {
        id: article!.id,
        name: articleName,
        amount: articleAmount,
        unit: articleUnit,
        active: article!.active,
        shopId: article!.shopId
      }
      dispatch(updateArticle(changedArticle));
      history.goBack();
    }

    const handleSelectChange = (event:any) => {
      setArticleUnit(event.target.value);
      setValueChanged(true);
    };
    
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
                          <FormControl fullWidth variant="filled">
                            <InputLabel id="unit-label">unit</InputLabel>
                            <Select
                              labelId="unit-label"
                              id="unit-select"
                              value={articleUnit}
                              onChange={handleSelectChange}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem value={"g"}>Gramm</MenuItem>
                              <MenuItem value={"l"}>liter</MenuItem>
                              <MenuItem value={"kg"}>KG</MenuItem>
                            </Select>
                          </FormControl>
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
