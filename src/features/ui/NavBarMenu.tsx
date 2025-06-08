import React, { FC } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { activeTeam, Team } from '../team/teamSlice';
import { useSelector } from 'react-redux';
import Sidedrawer from './Sidedrawer';
import { getAuth } from "firebase/auth";

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
}));

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Title = styled(Typography)(({ theme }) => ({
  flexGrow: 1,
}));

type NavBarMenuProps = {
  title: string
}

const NavBarMenu: FC<NavBarMenuProps> = ({title}) => {

  const actTeam: Team | undefined = useSelector(activeTeam);
  const drawerOpenState = React.useState(false);

  const handleSidedrawerClick = () => {
    drawerOpenState[1](true);
  };

  const teamName = () => actTeam ? actTeam.name : ''

  return (
    <Root>
      <Sidedrawer drawerOpenState={drawerOpenState} />
      <AppBar position="static">
        <Toolbar>
          <MenuButton edge="start" onClick={handleSidedrawerClick} color="inherit" aria-label="menu">
            <MenuIcon/>
          </MenuButton>
          <Title variant="h6">
            {title}
          </Title>
          <div>
            <Title>
              {getAuth().currentUser!.displayName +" | "+ teamName()}
            </Title>
          </div>
        </Toolbar>
      </AppBar>
    </Root>
  );
}

export default NavBarMenu;
