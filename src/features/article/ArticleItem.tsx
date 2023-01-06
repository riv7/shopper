import React, { FC, ReactElement } from 'react';
import { makeStyles, createStyles, Theme, alpha } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CheckCircleOutlineRoundedIcon from '@material-ui/icons/CheckCircleOutlineRounded';
import AddBoxIcon from '@material-ui/icons/AddBox';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import { Button, Chip, Menu, MenuItem } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import DoneIcon from '@material-ui/icons/Done';
import { Article, deleteArticle, increaseAmount } from './articleSlice';
import { updateArticle } from './articleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import LabelOverview from '../label/LabelOverview';
import { Label, labelById } from '../label/labelSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex",
    },
    menuButton: {
      justifyContent:'right'
    },
    increaseButton: {
      justifyContent:'right'
    },
    decreaseButton: {
      justifyContent:'left'
    },
    title: {
      flexGrow: 1,
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

const ArticleItem: FC<ArticleItemProps> = ({article, onLabelSelection}): ReactElement => {

  const classes = useStyles();
  const history = useHistory();
  const amountText = article.unit === '' ? article.amount : article.amount+' '+article.unit;
  const typoClass = article.active === false ? classes.typographyLight : classes.typography;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const label: Label | undefined = useSelector(labelById(article.labelId));

  const dispatch = useDispatch();

  var articleItem: Article = {...article};

  const handleIncreaseClick = (event:any) => {
    const newAmount = increaseAmount(article.amount, article.unit);
    articleItem.amount = newAmount;
    dispatch(updateArticle(articleItem));
  };

  const handleDecreaseClick = (event:any) => {
    const newAmount = article.amount - 1;
    articleItem.amount = newAmount;
    dispatch(updateArticle(articleItem));
  };

  const handleResolvedClick = (event:any) => {
    articleItem.active = !articleItem.active;
    dispatch(updateArticle(articleItem));
  };

  const handleEdit = () => {
    history.push(`editArticle/${article.id}`);
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
    console.info('You clicked the chip label icon.');
    onLabelSelection(article);
  };

  //helper
  

  return (
    <Card>
        <Grid container spacing={3}>
            <Grid item xs={1}>
                <CardActions>
                  <IconButton className={typoClass} aria-label="resolve" onClick={handleResolvedClick}>
                      <CheckCircleOutlineRoundedIcon />
                   </IconButton>
                </CardActions>
            </Grid>
            <Grid item xs={4} md={4}>
                <CardContent>
                    <Typography className={typoClass} variant="h5" component="h2">
                    {article.name}
                    </Typography>
                </CardContent>
            </Grid>
            <Grid item xs={2} md={2}>
              <CardContent>
                <Chip 
                  label={label === undefined ? "Select label..." : label.name}
                  style = {{backgroundColor: `${label === undefined ? '#a9a9a9' : label.color}`}}
                  onClick={handleClickChip}
                  onDelete={handleDeleteChip} />
                </CardContent>
            </Grid>
            <Grid item xs={4} md={4}>
                <Grid container spacing={3}>
                    <Grid item xs={2}>
                      <CardActions className={classes.decreaseButton}>
                        <IconButton className={typoClass} aria-label="decreaseAmount" onClick={handleDecreaseClick}>
                            <IndeterminateCheckBoxIcon />
                        </IconButton>
                      </CardActions>
                    </Grid>
                    <Grid item xs={8}>
                      <CardContent>
                        <Button variant="outlined" fullWidth onClick={handleEdit}>{amountText}</Button>
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
            </Grid>
            <Grid item xs={1}>
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
                  <MenuItem>
                    <IconButton
                      aria-label="article-edit"
                      color="inherit"
                      onClick={handleEdit}>
                      <EditIcon />
                    </IconButton>
                    Edit
                  </MenuItem>
                  <MenuItem>
                    <IconButton
                      aria-label="article-delete"
                      color="inherit"
                      onClick={handleDelete}>
                      <DeleteIcon />
                    </IconButton>
                    Delete
                  </MenuItem>
                </Menu>
              </CardActions>
            </Grid>
        </Grid>
    </Card>
  );
}

export default ArticleItem;
