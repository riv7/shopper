import React, { FC } from 'react';
import { styled } from '@mui/material/styles';
import Popover from '@mui/material/Popover';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { Article, decreaseAmount, increaseAmount, updateArticle } from './articleSlice';
import { SetStateAction } from 'react';
import { Dispatch } from 'react';
import { Card, CardActions, Grid, IconButton } from '@mui/material';
import IndeterminateCheckBoxIcon from '@mui/icons-material/IndeterminateCheckBox';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const StyledTypography = styled(Typography)(({ theme }) => ({
  padding: theme.spacing(2),
}));

const StyledIconButton = styled(IconButton)(({ theme }) => ({
  padding: 2,
}));

type ArticlePopoverProps = {
  article: Article
  open: boolean
  onClose: (article: Article | null) => void;
  anchorEl: HTMLButtonElement | null;
  setAnchorEl: Dispatch<SetStateAction<HTMLButtonElement | null>>;
}

const ArticlePopover: FC<ArticlePopoverProps> = ({article, open, onClose, anchorEl, setAnchorEl}) => {
  const navigate = useNavigate();
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
    navigate(`../editArticle/${article.id}`);
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
            <Grid>
            {/* <Typography>Hello</Typography> */}
              <CardActions>
                <IconButton aria-label="decreaseAmount" onClick={handleDecreaseClick}>
                  <IndeterminateCheckBoxIcon />
                </IconButton>
              </CardActions>
            </Grid>
            <Grid>
              {/* <Typography>Hello</Typography> */}
              <CardActions>
                <IconButton aria-label="increaseAmount" onClick={handleIncreaseClick}>
                  <AddBoxIcon />
                </IconButton>
              </CardActions>
            </Grid>
            <Grid>
            {/* <Typography>Hello</Typography> */}
              <CardActions>
                <IconButton
                  onClick={handleEdit}
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
