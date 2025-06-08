import React, { FC, ReactElement, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import { Box, Button, Chip } from '@mui/material';
import { Article } from './articleSlice';
import { updateArticle } from './articleSlice';
import { useDispatch, useSelector } from 'react-redux';
import { Label, labelById } from '../label/labelSlice';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import ArticlePopover from './ArticlePopover';

const Root = styled('div')({
  paddingTop: "2px"
});

const Bottom = styled('div')({
  paddingBottom: "2px"
});

const MenuButton = styled(CardActions)({
  justifyContent: 'flex-end'
});

const IncreaseButton = styled(CardActions)({
  justifyContent: 'right'
});

const DecreaseButton = styled(CardActions)({
  justifyContent: 'left'
});

const Title = styled(Typography)({
  flexGrow: 1,
});

const TextBox = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.75),
  maxWidth: "20ch",
}));

const TextBoxLight = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.25),
  maxWidth: "20ch",
}));

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.75)
}));

const StyledTypographyLight = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.25)
}));

type ArticleItemProps = {
  article: Article
  onLabelSelection: (article: Article) => void;
}

const ArticleItem: FC<ArticleItemProps> = ({ article, onLabelSelection }): ReactElement => {
  const amountText = article.unit === 'piece' ? article.amount : article.amount + ' ' + article.unit;
  const label: Label | undefined = useSelector(labelById(article.labelId));
  const [amountSelected, setAmountSelected] = useState(false);
  const [anchorAmountEl, setAnchorAmountEl] = React.useState<HTMLButtonElement | null>(null);

  const dispatch = useDispatch();

  var articleItem: Article = { ...article };

  const handleResolvedClick = () => {
    articleItem.active = !articleItem.active;
    dispatch(updateArticle(articleItem) as any);
  };

  const handleAmountSelect = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorAmountEl(event.currentTarget);
    setAmountSelected(true);
  }

  const handleDeleteChip = () => {
    articleItem.labelId = ''
    dispatch(updateArticle(articleItem) as any);
  };

  const handleClickChip = () => {
    onLabelSelection(article);
  };

  const handleArticlePopupClosed = (changedArticle: Article | null) => {
    setAmountSelected(false);
    if (changedArticle !== null) {
      dispatch(updateArticle(changedArticle) as any);
    }
  }

  return (
    <div>
      <Card>
        <Grid container spacing={1} >
          <Grid sx={{ width: '8.33%' }}>
            <CardActions>
              <IconButton 
                sx={{ color: article.active === false ? 
                  alpha('common.white', 0.25) : 
                  alpha('common.white', 0.75) 
                }} 
                aria-label="resolve" 
                onClick={handleResolvedClick}>
                <RadioButtonUncheckedIcon />
              </IconButton>
            </CardActions>
          </Grid>
          <Grid sx={{ width: '41.67%' }}>
            <CardContent>
              {article.active === false ? (
                <TextBoxLight variant="h5">
                  {article.name}
                </TextBoxLight>
              ) : (
                <TextBox variant="h5">
                  {article.name}
                </TextBox>
              )}
            </CardContent>
          </Grid>
          <Grid sx={{ width: '25%' }}>
            <CardContent>
              <Button onClick={event => handleAmountSelect(event)}>{amountText}</Button>
            </CardContent>
          </Grid>
          <Grid sx={{ width: '25%' }}>
            <Box display="flex" justifyContent="flex-end">
              <CardContent>
                <Chip
                  label={label === undefined ? "Shop..." : label.name.length < 6 ? label.name : label.name.substring(0,5)+'..'}
                  sx={{ backgroundColor: `${label === undefined ? '#a9a9a9' : label.color}` }}
                  onClick={handleClickChip}
                  onDelete={handleDeleteChip} />
              </CardContent>
            </Box>
          </Grid>
        </Grid>
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
