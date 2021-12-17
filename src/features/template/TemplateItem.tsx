import React, { FC, ReactElement } from 'react';
import { makeStyles, createStyles, Theme, alpha } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import MenuIcon from '@material-ui/icons/Menu';
import { Menu, MenuItem } from '@material-ui/core';
import { useDispatch } from 'react-redux';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import { addTemplate, Template } from './templateSlice';
import { addArticle, Article } from '../article/articleSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: "flex"
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
    typography: {
      color: alpha(theme.palette.common.white, 0.75)
    },
    typographyLight: {
      color: alpha(theme.palette.common.white, 0.25)
    },
    title: {
      flexGrow: 1,
    },
  }),
);

type TemplateItemProps = {
    template: Template,
    shopId: string,
    presentArticle: Article | undefined
}

const TemplateItem: FC<TemplateItemProps> = ({template, shopId, presentArticle}): ReactElement => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const typoClass = presentArticle !== undefined ? classes.typographyLight : classes.typography;
  const amountText = (article: Article) => article.unit === '' ? article.amount : article.amount+' '+article.unit;
  const amountInArticles = presentArticle !== undefined ?  amountText(presentArticle) : '';

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    // dispatch(deleteShop(shop));
  }

  const handleEdit = () => {
    // history.push(`shop/editShop/${shop.id}`)
  }

  const handleSelectClick = (event:any) => {
    // history.push(`articles/${shop.id}`);
  };

  const handleAddClick = () => {

    if (template.id === '') {
      dispatch(addTemplate(template));
    }

    if (presentArticle === undefined) {
      const article = {
        id: '',
        name: template.name,
        amount: 1,
        unit: "piece",
        active: true,
        shopId: shopId
      };
      dispatch(addArticle(article));
    }

    history.goBack();
  }

  return (
    <Card className={classes.root}>
        <Grid container spacing={3}>
            <Grid item xs={1}>
                <CardActions>
                  <IconButton className={typoClass} aria-label="addIcon" onClick={handleAddClick}>
                      <AddCircleOutlineIcon />
                   </IconButton>
                </CardActions>
            </Grid>
            <Grid item xs={5}>
                <CardContent>
                    <Typography className={typoClass} variant="h5" component="h2" >
                    {template.name}
                    </Typography>
                </CardContent>
            </Grid>
            <Grid item xs={4}>
                <CardContent>
                  {presentArticle !== undefined &&
                   <Typography className={typoClass} variant="h6" >
                     {amountInArticles}
                   </Typography>}
                </CardContent>
            </Grid>
            <Grid item xs={2}>
                <CardActions className={classes.menuButton}>
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
                    <MenuItem>
                      <IconButton
                        aria-label="shop-edit"
                        color="inherit"
                        onClick={handleEdit}>
                        <EditIcon />
                      </IconButton>
                      Edit
                    </MenuItem>
                    <MenuItem>
                      <IconButton
                        aria-label="shop-delete"
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

export default TemplateItem;


