import React, { FC } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Popover from '@material-ui/core/Popover';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { Article, decreaseAmount, increaseAmount, updateArticle } from './articleSlice';
import { SetStateAction } from 'react';
import { Dispatch } from 'react';
import { Card, CardActions, Grid, IconButton } from '@material-ui/core';
import IndeterminateCheckBoxIcon from '@material-ui/icons/IndeterminateCheckBox';
import AddBoxIcon from '@material-ui/icons/AddBox';
import EditIcon from '@material-ui/icons/Edit';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    typography: {
      padding: theme.spacing(2),
    },
    icon: {
      padding: 2,
    },
  }),
);

type ArticlePopoverProps = {
  article: Article
  open: boolean
  onClose: (article: Article | null) => void;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
}

const ArticlePopover: FC<ArticlePopoverProps> = ({article, open, onClose, anchorEl, setAnchorEl}) => {

  const classes = useStyles();
  const history = useHistory();
  // const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  // const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
  //   setAnchorEl(event.currentTarget);
  // };

  var articleItem: Article = { ...article };

  const dispatch = useDispatch();

  const handleClose = () => {
    setAnchorEl(null);
    onClose(null)
  };

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

  const handleEdit = () => {
    history.push(`../editArticle/${article.id}`);
  }

  const id = open ? 'simple-popover' : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        <Card>
          <Grid container spacing={0}>
            <Grid item>
            {/* <Typography>Hello</Typography> */}
              <CardActions>
                <IconButton aria-label="decreaseAmount" onClick={handleDecreaseClick}>
                  <IndeterminateCheckBoxIcon />
                </IconButton>
              </CardActions>
            </Grid>
            <Grid item>
              {/* <Typography>Hello</Typography> */}
              <CardActions >
                <IconButton aria-label="increaseAmount" onClick={handleIncreaseClick}>
                  <AddBoxIcon />
                </IconButton>
              </CardActions>
            </Grid>
            <Grid item>
            {/* <Typography>Hello</Typography> */}

              <CardActions>
              <IconButton
                  onClick={handleEdit}
                      // className={classes.icon}
                        aria-label="team-edit"
                        color="inherit">
                        <EditIcon />
                      </IconButton>
                {/* <Button variant="contained" color="secondary"></Button> */}
              </CardActions>
            </Grid>
          </Grid>
        </Card>
      </Popover>
    </div>
  );
}

export default ArticlePopover;
