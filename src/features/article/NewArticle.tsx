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
    
    const handleAddClick = () => {
        dispatch(addArticle(articleName));
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
              <Grid item>
                <TextField 
                  id="standard-basic" 
                  label="Enter article name ..."
                  variant="outlined"
                  fullWidth 
                  value={articleName}
                  onChange={event => setArticleName(event.target.value)}/>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
    );
};

export default NewArticle;
