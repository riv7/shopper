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

const Root = styled('div')({
  paddingTop: "2px"
});

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
  color: alpha(theme.palette.common.white, 0.75),
  fontSize: "0.9rem" // Reduced from default 1.25rem
}));

const StyledTypographyLight = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.25),
  fontSize: "0.9rem" // Reduced from default 1.25rem
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
      navigate(`/templates/editTemplate/${template.id}`);
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
      <Card>
        <Grid container spacing={0} alignItems="center">
            <Grid sx={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
              <IconButton 
                aria-label="addIcon" 
                onClick={handleAddClick}
                sx={(theme) => ({ 
                  color: presentArticle !== undefined ? 
                    alpha(theme.palette.common.white, 0.25) : 
                    alpha(theme.palette.common.white, 0.75) 
                })}>
                <AddCircleOutlineIcon />
              </IconButton>
            </Grid>
            <Grid sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {presentArticle !== undefined ? 
                <StyledTypographyLight variant="h6">
                  {template.name}
                </StyledTypographyLight> :
                <StyledTypography variant="h6">
                  {template.name}
                </StyledTypography>
              }
            </Grid>
            <Grid sx={{ mx: 2 }}>
              <AmountOrSelect />
            </Grid>
            <Grid sx={{ pr: 1 }}>
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
            </Grid>
        </Grid>
      </Card>
    </Root>
  );
}

export default TemplateItem;
