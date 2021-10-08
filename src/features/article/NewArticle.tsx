import { Container, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
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
                                  <TextField 
                                    id="article-amount" 
                                    label="Enter article amount ..."
                                    variant="outlined"
                                    fullWidth 
                                    value={articleAmount}
                                    onChange={event => setArticleAmount(Number(event.target.value))}/>
                                </Grid>
                                <Grid item>
                                  <TextField 
                                    id="article-unit" 
                                    label="Enter article unit ..."
                                    variant="outlined"
                                    fullWidth 
                                    value={articleUnit}
                                    onChange={event => setArticleUnit(event.target.value)}/>
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


              {/* <Grid item>
                <TextField 
                  id="article-name" 
                  label="Enter article name ..."
                  variant="outlined"
                  fullWidth 
                  value={articleName}
                  onChange={event => setArticleName(event.target.value)}/>
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
              <Grid item>
                <TextField 
                  id="article-amount" 
                  label="Enter article amount ..."
                  variant="outlined"
                  fullWidth 
                  value={articleAmount}
                  onChange={event => setArticleAmount(Number(event.target.value))}/>
              </Grid>
              <Grid item>
                <TextField 
                  id="article-unit" 
                  label="Enter article unit ..."
                  variant="outlined"
                  fullWidth 
                  value={articleUnit}
                  onChange={event => setArticleUnit(event.target.value)}/>
              </Grid> */}
            </Grid>
          </div>
        </Container>
      </div>
    );
};

export default NewArticle;
