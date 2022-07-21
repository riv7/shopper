import React, { FC, ReactElement } from 'react';
import { makeStyles, createStyles, Theme, alpha } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Menu, MenuItem } from '@material-ui/core';
import { useDispatch, useSelector } from 'react-redux';
import ShopIcon from '@material-ui/icons/Shop';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import { useHistory } from 'react-router-dom';
import { activeTeam, setTeamActive, Team } from './teamSlice';
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';

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
      color: alpha(theme.palette.secondary.main, 0.75)
    },
  }),
);

type TeamItemProps = {
    team: Team
}

const TeamItem: FC<TeamItemProps> = ({team}): ReactElement => {

  const classes = useStyles();
  const dispatch = useDispatch();
  const history = useHistory();
  const actTeam: Team | undefined = useSelector(activeTeam);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isActiveTeam = actTeam && team.id === actTeam.id;
  const typoClass = isActiveTeam ? classes.typographyLight : classes.typography;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    console.log("TODO handle delete")
    // dispatch(delte(shop));
  }

  const handleEdit = () => {
    history.push(`edit/${team.id}`)
  }

  const handleSelect = () => {
    dispatch(setTeamActive(team))
    // history.push('/');
  }

  return (
    <Card>
        <Grid container spacing={3}>
            <Grid item xs={1}>
                <CardActions>
                  <IconButton aria-label="team" onClick={handleSelect}>
                      {isActiveTeam ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
                   </IconButton>
                </CardActions>
            </Grid>
            <Grid item xs={9}>
                <CardContent>
                    <Typography className={typoClass} variant="h5" component="h2">
                    {isActiveTeam ? team.name + " (active)" : team.name}
                    </Typography>
                </CardContent>
            </Grid>
            <Grid item xs={2}>
                <CardActions className={classes.menuButton}>
                  <IconButton 
                     aria-label="team select"
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
                        aria-label="team-edit"
                        color="inherit"
                        onClick={handleEdit}>
                        <EditIcon />
                      </IconButton>
                      Edit
                    </MenuItem>
                    <MenuItem>
                      <IconButton
                        aria-label="team-delete"
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

export default TeamItem;


