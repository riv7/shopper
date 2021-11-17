import { Container, createStyles, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addArticle } from './articleSlice';
import NavBarBack from '../ui/NavBarBack';
import { RouteComponentProps, useHistory } from 'react-router-dom';

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

type NewArticleRouteProps = {
  shopId: string;
}

const NewArticle: FC<RouteComponentProps<NewArticleRouteProps>> = ({match}): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const history = useHistory();
    const [articleName, setArticleName] = useState('');
    const [articleUnit, setArticleUnit] = useState('');
    const [articleAmount, setArticleAmount] = useState(0);
    const shopId: string = match.params.shopId
    
    const handleAddClick = () => {
        const article = {
          id: '',
          name: articleName,
          amount: articleAmount,
          unit: articleUnit,
          active: true,
          shopId: shopId
        }
        dispatch(addArticle(article));
        history.goBack();
    }

    const handleSelectChange = (event:any) => {
      setArticleUnit(event.target.value);
    };

    const SaveButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="save"
        disabled={articleName === ''}
        onClick={handleAddClick}>
        <SaveIcon />
      </IconButton>;

    return (
      <div>
        <NavBarBack title="Enter article" childComp={<SaveButton/>} />
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
                      label="Enter article name ..."
                      variant="outlined"
                      fullWidth 
                      value={articleName}
                      onChange={event => setArticleName(event.target.value)}/>
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
                            onChange={event => setArticleAmount(Number(event.target.value))}/>
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

export default NewArticle;
