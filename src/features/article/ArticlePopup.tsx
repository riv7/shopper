import React, { FC, useState } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Button, CardActions, CardContent, Chip, Container, Grid, IconButton, ListItemIcon, ListItemText, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import InfoIcon from '@mui/icons-material/Info';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import SelectUnit from '../ui/SelectUnit';
import { Article } from './articleSlice';
import AddBoxIcon from '@mui/icons-material/AddBox';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '50px'
}));

const TextInput = styled(TextField)(({ theme }) => ({
  marginLeft: '5px'
}));

const IncreaseButton = styled(CardActions)({
  justifyContent: 'right'
});

const DecreaseButton = styled(CardActions)({
  justifyContent: 'left'
});

type ArticlePopupProps = {
  article: Article
  open: boolean
  onClose: (article: Article | null) => void;
}

const ArticlePopup: FC<ArticlePopupProps> = ({article, open, onClose}) => {
  const [articleName, setArticleName] = useState(article === undefined ? '' : article.name);
  const [articleAmount, setArticleAmount] = useState(article === undefined ? 0 : article.amount);
  const valueChangedState = useState(false);
  const [valueChanged, setValueChanged] = valueChangedState;
  const unitState = useState(article === undefined ? '' : article.unit);
  const [selectedUnit] = unitState;

  const amountText = article.amount;

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
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Increase amount</DialogTitle>

      <Container>
          <form>
            <Root>
              <Grid
                container
                justifyContent="center"
                spacing={0}
                direction="row">

                <Grid
                  container
                  justifyContent="center"
                  direction="column"
                  spacing={3}>
                  <Grid sx={{ width: '100%' }}>
                    <Grid container spacing={1}>
                      <Grid sx={{ width: '16.67%' }}>
                        <DecreaseButton>
                          <IconButton aria-label="decreaseAmount">
                            <IndeterminateCheckBoxIcon />
                          </IconButton>
                        </DecreaseButton>
                      </Grid>
                      <Grid sx={{ width: '66.67%' }}>
                        <CardContent>
                          <Button>{amountText}</Button>
                        </CardContent>
                      </Grid>
                      <Grid sx={{ width: '16.67%' }}>
                        <IncreaseButton>
                          <IconButton aria-label="increaseAmount">
                            <AddBoxIcon />
                          </IconButton>
                        </IncreaseButton>
                      </Grid>
                    </Grid>
                  </Grid>
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
    </Dialog>
  );
}

export default ArticlePopup;
