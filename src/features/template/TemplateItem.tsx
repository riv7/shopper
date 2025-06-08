import React, { FC, ReactElement, useState } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem } from '@mui/material';
import { useDispatch } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { addTemplate, deleteTemplate, Template } from './templateSlice';
import { addArticle, Article } from '../article/articleSlice';
import { showMessage } from '../message/messageSlice';
import SelectUnit from '../ui/SelectUnit';
import { labelById } from '../label/labelSlice';

const Root = styled(Card)(({ theme }) => ({
  display: "flex"
}));

const MenuButtonContainer = styled(CardActions)({
  justifyContent: 'right'
});

const IncreaseButtonContainer = styled(CardActions)({
  justifyContent: 'right'
});

const DecreaseButtonContainer = styled(CardActions)({
  justifyContent: 'left'
});

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.75)
}));

const StyledTypographyLight = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.25)
}));

const Title = styled(Typography)({
  flexGrow: 1,
});

const StyledFormControl = styled('div')(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.1),
  margin: theme.spacing(1),
}));

type TemplateItemProps = {
    template: Template,
    labelId: string,
    presentArticle: Article | undefined
}

const TemplateItem: FC<TemplateItemProps> = ({template, labelId, presentArticle}): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const unitState = useState("piece");
  const [selectedUnit] = unitState;
  const amountText = (article: Article) => article.unit === '' ? article.amount : article.amount+' '+article.unit;
  const amountInArticles = presentArticle !== undefined ?  amountText(presentArticle) : '';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    if (template.global === false) {
      dispatch(deleteTemplate(template.id));
    } else {
      dispatch(showMessage({ status: "error", message: "Only user created templates can be deleted" }));
    }
  }

  const handleEdit = () => {
    if (template.global === false) {
      navigate(`editTemplate/${template.id}`);
    } else {
      dispatch(showMessage({ status: "error", message: "Only user created templates can be edited" }));
    }
  }

  const handleAddClick = () => {
    if (template.id === '') {
      dispatch(addTemplate(template));
    }

    if (presentArticle === undefined) {
      const article = {
        id: '',
        name: template.name,
        amount: 1,
        unit: selectedUnit,
        active: true,
        labelId: labelId === 'all' ? '' : labelId
      };
      dispatch(addArticle(article));
    }

    navigate(-1);
  }

  const AmountOrSelect: FC = () => {
    if (template.id === '') {
      return (
        <SelectUnit unitState={unitState} />
      )
    } else if (presentArticle === undefined) {
      return (
        <Typography></Typography>
      )
    } else {
      return (
        presentArticle !== undefined ? 
          <StyledTypographyLight variant="h6">
            {amountInArticles}
          </StyledTypographyLight> :
          <StyledTypography variant="h6">
            {amountInArticles}
          </StyledTypography>
      )
    }
  }

  return (
    <Root>
        <Grid container spacing={3}>
            <Grid sx={{ width: '8.33%' }}>
                <CardActions>
                  <IconButton 
                    aria-label="addIcon" 
                    onClick={handleAddClick}
                    sx={{ color: presentArticle !== undefined ? 
                      alpha('common.white', 0.25) : 
                      alpha('common.white', 0.75) 
                    }}>
                      <AddCircleOutlineIcon />
                   </IconButton>
                </CardActions>
            </Grid>
            <Grid sx={{ width: '41.67%' }}>
                <CardContent>
                    {presentArticle !== undefined ? 
                      <StyledTypographyLight variant="h5">
                        {template.name}
                      </StyledTypographyLight> :
                      <StyledTypography variant="h5">
                        {template.name}
                      </StyledTypography>
                    }
                </CardContent>
            </Grid>
            <Grid sx={{ width: '33.33%' }}>
                <CardContent>
                  <AmountOrSelect />
                </CardContent>
            </Grid>
            <Grid sx={{ width: '16.67%' }}>
                <MenuButtonContainer>
                  <IconButton 
                     aria-label="shop menu"
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
                        aria-label="shop-edit"
                        color="inherit" >
                        <EditIcon />
                      </IconButton>
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                      <IconButton
                        aria-label="shop-delete"
                        color="inherit">
                        <DeleteIcon />
                      </IconButton>
                      Delete
                    </MenuItem>
                  </Menu>
                </MenuButtonContainer>
            </Grid>
        </Grid>
    </Root>
  );
}

export default TemplateItem;
