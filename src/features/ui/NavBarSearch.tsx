import React, { FC, ReactNode } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SearchIcon from '@mui/icons-material/Search';
import InputBase from '@mui/material/InputBase';
import { useNavigate } from 'react-router-dom';

const Root = styled('div')({
  flexGrow: 1,
});

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: theme.palette.secondary.main
}));

const Grow = styled('div')({
  flexGrow: 1,
});

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const StyledTitle = styled(Typography)(({ theme }) => ({
  display: 'none',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  minWidth: '120px', // Ensure enough width for "add articles"
  [theme.breakpoints.up('sm')]: {
    display: 'block',
  },
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.8),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.9),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('lg')]: {
    marginLeft: theme.spacing(3),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  color: theme.palette.secondary.main,
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: theme.palette.secondary.main,
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '23ch',
    },
  },
}));

type NavBarSearchProps = {
  title: string,
  onChange: any,
  childComp?: ReactNode
}

const NavBarSearch: FC<NavBarSearchProps> = ({ title, onChange, childComp }) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  }

  return (
    <Root>
      <StyledAppBar position="static">
        <Toolbar>
          <MenuButton
            edge="start"
            color="inherit" 
            aria-label="back"
            onClick={handleBackClick}>
            <ArrowBackIosIcon />
          </MenuButton>
          <StyledTitle variant="h6">
            {title}
          </StyledTitle>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              inputProps={{ 'aria-label': 'search', maxLength: 23 }}
              onChange={onChange}
            />
          </Search>
          <Grow />
          {childComp}
        </Toolbar>
      </StyledAppBar>
    </Root>
  );
}

export default NavBarSearch;
