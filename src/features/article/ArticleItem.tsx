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
  maxWidth: "23ch",
  fontSize: "0.9rem", // Reduced from default 1.25rem
}));

const TextBoxLight = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.25),
  maxWidth: "23ch",
  fontSize: "0.9rem", // Reduced from default 1.25rem
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
        <Grid container spacing={0} alignItems="center">
          <Grid sx={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
            <IconButton 
              sx={(theme) => ({ 
                color: article.active === false ? 
                  alpha(theme.palette.common.white, 0.25) : 
                  alpha(theme.palette.common.white, 0.75) 
              })} 
              aria-label="resolve" 
              onClick={handleResolvedClick}>
              <RadioButtonUncheckedIcon />
            </IconButton>
          </Grid>
          <Grid sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {article.active === false ? (
              <TextBoxLight variant="h6">
                {article.name}
              </TextBoxLight>
            ) : (
              <TextBox variant="h6">
                {article.name}
              </TextBox>
            )}
          </Grid>
          <Grid sx={{ mx: 2 }}>
            <Button 
              size="small" 
              variant="text" 
              onClick={event => handleAmountSelect(event)}
            >
              {amountText}
            </Button>
          </Grid>
          <Grid sx={{ pr: 1 }}>
            <Chip
              size="small"
              label={label === undefined ? "S" : label.name.length < 2 ? label.name : label.name.substring(0,1)}
              sx={{ backgroundColor: `${label === undefined ? '#a9a9a9' : label.color}` }}
              onClick={handleClickChip} />
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
