import React, { FC, ReactNode } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { alpha } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import ArrowBackIosIcon from '@material-ui/icons/ArrowBackIos';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from '@material-ui/core/InputBase';
import { useHistory } from 'react-router-dom';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    appbar: {
      // background: alpha(theme.palette.secondary.main, 0.7)
      background: theme.palette.secondary.main
    },
    grow: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      display: 'none',
      [theme.breakpoints.up('sm')]: {
        display: 'block',
      },
    },
    search: {
      position: 'relative',
      borderRadius: theme.shape.borderRadius,
      backgroundColor: alpha(theme.palette.common.white, 0.8),
      '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.9),
      },
      marginRight: theme.spacing(2),
      marginLeft: 0,
      width: '100%'
      ,
      [theme.breakpoints.up('lg')]: {
        marginLeft: theme.spacing(3),
        width: 'auto',
      },
    },
    searchIcon: {
      color: theme.palette.secondary.main,
      padding: theme.spacing(0, 2),
      height: '100%',
      position: 'absolute',
      pointerEvents: 'none',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    inputRoot: {
      color: theme.palette.secondary.main,
    },
    inputInput: {
      padding: theme.spacing(1, 1, 1, 0),
      // vertical padding + font size from searchIcon
      paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
      transition: theme.transitions.create('width'),
      width: '100%',
      [theme.breakpoints.up('md')]: {
        width: '20ch',
      },
    },
  }),
);

type NavBarSearchProps = {
  title: string,
  onChange: any,
  childComp?: ReactNode
}

const NavBarSearch: FC<NavBarSearchProps> = ({ title, onChange, childComp }) => {
  const classes = useStyles();
  const history = useHistory();

  const handleBackClick = () => {
    history.goBack();
  }

  return (
    <div className={classes.root}>
      <AppBar className={classes.appbar} position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit" aria-label="back"
            onClick={handleBackClick}>
            <ArrowBackIosIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            {title}
          </Typography>
          <div className={classes.search}>
            <div className={classes.searchIcon}>
              <SearchIcon />
            </div>
            <InputBase
              placeholder="Search…"
              classes={{
                root: classes.inputRoot,
                input: classes.inputInput,
              }}
              inputProps={{ 'aria-label': 'search', maxlength: 16 }}
              onChange={onChange}
            />
          </div>
          <div className={classes.grow} />
          {childComp}
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default NavBarSearch;