import { Container, createStyles, FormControl, Grid, InputLabel, makeStyles, MenuItem, Select, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addArticle } from './articleSlice';
import NavBarBack from '../ui/NavBarBack';

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

const NewArticle: FC = (): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const [articleName, setArticleName] = useState('');
    const [articleShop, setArticleShop] = useState('');
    const [articleUnit, setArticleUnit] = useState('');
    const [articleAmount, setArticleAmount] = useState(0);
    
    const handleAddClick = () => {
        const article = {
          id: '',
          name: articleName,
          amount: articleAmount,
          unit: articleUnit,
          active: true,
          shop: articleShop
        }
        dispatch(addArticle(article));
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
                  <Grid item>
                    <TextField 
                      id="article-shop" 
                      label="Enter article shop ..."
                      variant="outlined"
                      fullWidth 
                      value={articleShop}
                      onChange={event => setArticleShop(event.target.value)}/>
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
