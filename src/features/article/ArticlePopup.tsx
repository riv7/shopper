import React, { FC, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Button, CardActions, CardContent, Chip, Container, createStyles, Grid, IconButton, ListItemIcon, ListItemText, makeStyles, TextField, Theme } from '@material-ui/core';
import { useSelector } from 'react-redux';
import InfoIcon from '@material-ui/icons/Info';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import RemoveCircleOutlineIcon from '@material-ui/icons/RemoveCircleOutline';
import SelectUnit from '../ui/SelectUnit';
import { Article } from './articleSlice';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '50px'
    },
    textInput: {
      marginLeft: '5px'
    },
    increaseButton: {
      justifyContent: 'right'
    },
    decreaseButton: {
      justifyContent: 'left'
    },
  })
);

type ArticlePopupProps = {
  article: Article
  open: boolean
  onClose: (article: Article | null) => void;
}

const LabelPopup: FC<ArticlePopupProps> = ({article, open, onClose}) => {

  const classes = useStyles();
  const [articleName, setArticleName] = useState(article === undefined ? '' : article.name);
  const [articleAmount, setArticleAmount] = useState(article === undefined ? 0 : article.amount);
  const valueChangedState = useState(false);
  const [valueChanged, setValueChanged] = valueChangedState;
  const unitState = useState(article === undefined ? '' : article.unit);
  const [selectedUnit] = unitState;

  const amountText = article.amount;





//const LabelPopup: FC<ArticlePopupProps> = ({selectedLabel, open, onClose}) => {

 // const allLabels: Label[] = useSelector(labels);

  const handleDeleteChip = () => {
    console.info('You clicked the delete icon.');
  };

  const handleClose = () => {

    var changedArticle = null;
    if (valueChanged === true) {
      changedArticle = {
        id: article!.id,
        name: articleName,
        amount: articleAmount,
        unit: selectedUnit,
        active: article!.active,
        labelId: article!.labelId
      }
    }

    onClose(changedArticle);
    // onClose(selectedValue);
  };

  // const handleLabelClick = (label: Label) => {
  //   onClose(label);
  // };


  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Increase amount</DialogTitle>

      <Container>
          <form>
            <div className={classes.root}>
              <Grid
                container
                justify="center"
                // alignItems="flex-start"
                spacing={0}
                // style={{ minHeight: '100vh' }}
                direction="row">

                <Grid
                  container
                  justify="center"
                  direction="column"
                  spacing={3}>
                  <Grid item xs={12} md={12}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <CardActions className={classes.decreaseButton}>
                  <IconButton aria-label="decreaseAmount" >
                  {/* <IconButton aria-label="decreaseAmount" onClick={handleDecreaseClick}> */}
                    <IndeterminateCheckBoxIcon />
                  </IconButton>
                </CardActions>
              </Grid>
              <Grid item xs={8}>
                <CardContent>
                  <Button>{amountText}</Button>
                  {/* <Button onClick={handleAmountSelect}>{amountText}</Button> */}
                </CardContent>
              </Grid>
              <Grid item xs={2}>
                <CardActions className={classes.increaseButton}>
                  {/* <IconButton aria-label="increaseAmount" onClick={handleIncreaseClick}> */}
                  <IconButton aria-label="increaseAmount">
                    <AddBoxIcon />
                  </IconButton>
                </CardActions>
              </Grid>
            </Grid>
          </Grid>
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

      

    </Dialog>
  );
}

export default LabelPopup;
