import React, { FC, ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { deleteLabel, Label } from './labelSlice';
import LabelImportantIcon from '@mui/icons-material/LabelImportant';
import { useDispatch } from 'react-redux';

const Root = styled('div')({
  display: "flex",
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

const Title = styled(Typography)({
  flexGrow: 1,
});

type LabelItemProps = {
    label: Label
}

const LabelItem: FC<LabelItemProps> = ({label}): ReactElement => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(deleteLabel(label));
  }

  const handleEdit = () => {
    navigate(`editLabel/${label.id}`)
  }

  return (
    <Card>
        <Grid container spacing={3}>
            <Grid sx={{ width: '8.33%' }}>
                <CardActions>
                  <IconButton 
                  aria-label="label"
                  style = {{color: `${label.color}`}} >
                      <LabelImportantIcon />
                   </IconButton>
                </CardActions>
            </Grid>
            <Grid sx={{ width: '75%' }}>
                <CardContent>
                    <Typography variant="h5">
                    {label.name}
                    </Typography>
                </CardContent>
            </Grid>
            <Grid sx={{ width: '16.67%' }}>
                <MenuButtonContainer>
                  <IconButton 
                     aria-label="label menu"
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
                        aria-label="label-edit"
                        color="inherit">
                        <EditIcon />
                      </IconButton>
                      Edit
                    </MenuItem>
                    <MenuItem onClick={handleDelete}>
                      <IconButton
                        aria-label="label-delete"
                        color="inherit">
                        <DeleteIcon />
                      </IconButton>
                      Delete
                    </MenuItem>
                  </Menu>
                </MenuButtonContainer>
            </Grid>
        </Grid>
    </Card>
  );
}

export default LabelItem;
