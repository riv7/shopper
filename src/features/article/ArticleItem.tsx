import React, { FC, ReactElement, useState } from 'react';
import { makeStyles, createStyles, Theme, alpha } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { Box, Button, Chip, Hidden, Menu, MenuItem } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { Article, decreaseAmount, deleteArticle, increaseAmount } from './articleSlice';
import { updateArticle } from './articleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Label, labelById } from '../label/labelSlice';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import ArticlePopup from './ArticlePopup';
import ArticlePopover from './ArticlePopover';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingTop: "2px"
    },
    artName: {
      width: 5
    },
    bottom: {
      paddingBottom: "2px"
    },
    menuButton: {
      justifyContent: 'flex-end'
    },
    increaseButton: {
      justifyContent: 'right'
    },
    decreaseButton: {
      justifyContent: 'left'
    },
    title: {
      flexGrow: 1,
    },
    textbox: {
      color: alpha(theme.palette.common.white, 0.75),
      width: 100,
      overflow: 'visible',
      textOverflow: 'ellipsis'
    },
    textboxLight: {
      color: alpha(theme.palette.common.white, 0.25),
      width: 100,
      overflow: 'visible',
      textOverflow: 'ellipsis'
    },
    typography: {
      color: alpha(theme.palette.common.white, 0.75)
    },
    typographyLight: {
      color: alpha(theme.palette.common.white, 0.25)
    },
  }),
);

type ArticleItemProps = {
  article: Article
  onLabelSelection: (article: Article) => void;
}

const ArticleItem: FC<ArticleItemProps> = ({ article, onLabelSelection }): ReactElement => {

  const classes = useStyles();
  const history = useHistory();
  // const amountText = article.unit === '' ? article.amount : article.amount + ' ' + article.unit;
  const amountText = article.amount;
  const typoClass = article.active === false ? classes.typographyLight : classes.typography;
  const textboxCass = article.active === false ? classes.textboxLight : classes.textbox;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const label: Label | undefined = useSelector(labelById(article.labelId));
  const [amountSelected, setAmountSelected] = useState(false);
  const [anchorAmountEl, setAnchorAmountEl] = React.useState<HTMLButtonElement | null>(null);


  const dispatch = useDispatch();

  var articleItem: Article = { ...article };

  const handleIncreaseClick = () => {
    const newAmount = increaseAmount(article.amount, article.unit);
    articleItem.amount = newAmount;
    dispatch(updateArticle(articleItem));
  };

  const handleDecreaseClick = () => {
    const newAmount = decreaseAmount(article.amount, article.unit);
    articleItem.amount = newAmount;
    dispatch(updateArticle(articleItem));
  };

  const handleResolvedClick = () => {
    articleItem.active = !articleItem.active;
    dispatch(updateArticle(articleItem));
  };

  const handleEdit = () => {
    history.push(`../editArticle/${article.id}`);
  }

  const handleAmountSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorAmountEl(event.currentTarget);
    setAmountSelected(true);
  }

  const handleDelete = () => {
    dispatch(deleteArticle(article.id));
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDeleteChip = () => {
    articleItem.labelId = ''
    dispatch(updateArticle(articleItem));
  };

  const handleClickChip = () => {
    onLabelSelection(article);
  };

  const handleArticlePopupClosed = (changedArticle: Article | null) => {
    setAmountSelected(false);
    if (changedArticle !== null) {
      dispatch(updateArticle(changedArticle));
    }
  }

  return (
    <div>
      <Card>
        <Grid container spacing={1} >
          <Grid item xs={1}>
            <CardActions>
              <IconButton className={typoClass} aria-label="resolve" onClick={handleResolvedClick}>
                <RadioButtonUncheckedIcon />
              </IconButton>
            </CardActions>
          </Grid>
          <Grid item xs={6} md={6}>
            <CardContent>
              <Typography className={textboxCass} variant="h5" component="h2">
                {article.name}
              </Typography>
            </CardContent>
          </Grid>
          <Grid item xs={2} md={2}>
            <CardContent>
              <Button onClick={event => handleAmountSelect(event)}>{amountText}</Button>
            </CardContent>
          </Grid>
          {/* <Grid item xs={5} md={3}>
            <Grid container spacing={1}>
              <Grid item xs={2}>
                <CardActions className={classes.decreaseButton}>
                  <IconButton className={typoClass} aria-label="decreaseAmount" onClick={handleDecreaseClick}>
                    <IndeterminateCheckBoxIcon />
                  </IconButton>
                </CardActions>
              </Grid>
              <Grid item xs={8}>
                <CardContent>
                  <Button onClick={event => handleAmountSelect(event)}>{amountText}</Button>
                </CardContent>
              </Grid>
              <Grid item xs={2}>
                <CardActions className={classes.increaseButton}>
                  <IconButton className={typoClass} aria-label="increaseAmount" onClick={handleIncreaseClick}>
                    <AddBoxIcon />
                  </IconButton>
                </CardActions>
              </Grid>
            </Grid>
          </Grid> */}
          <Grid item xs={3} md={3}>
            <Box display="flex" justifyContent="flex-end">
              <CardContent>
                <Chip
                  label={label === undefined ? "Shop..." : label.name.length < 6 ? label.name : label.name.substring(0,5)+'..'}
                  style={{ backgroundColor: `${label === undefined ? '#a9a9a9' : label.color}` }}
                  onClick={handleClickChip}
                  onDelete={handleDeleteChip} />
              </CardContent>
            </Box>
          </Grid>
        </Grid>

        {/* <Grid item xs={1}>
            <CardActions className={classes.menuButton}>
              <IconButton
                aria-label="article menu"
                aria-controls="simple"
                aria-haspopup="true"
                onClick={handleClick}>
                <MenuIcon />
              </IconButton>
              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={handleClose}>
                <MenuItem onClick={handleEdit}>
                  <IconButton
                    aria-label="article-edit"
                    color="inherit">
                    <EditIcon />
                  </IconButton>
                  Edit
                </MenuItem>
                <MenuItem onClick={handleDelete}>
                  <IconButton
                    aria-label="article-delete"
                    color="inherit">
                    <DeleteIcon />
                  </IconButton>
                  Delete
                </MenuItem>
              </Menu>
            </CardActions>
          </Grid> */}
        {/* </Grid> */}
        {/* <ArticlePopup article={article} open={amountSelected} onClose={handleArticlePopupClosed} /> */}
        <ArticlePopover article={article} 
          open={amountSelected} 
          onClose={handleArticlePopupClosed}
          anchorEl={anchorAmountEl}
          setAnchorEl={setAnchorAmountEl} />
      </Card>
    </div>
    );
}

export default ArticleItem;
