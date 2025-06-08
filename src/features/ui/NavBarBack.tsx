import React, { FC, ReactNode } from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { useNavigate } from 'react-router-dom';

const Root = styled('div')({
  flexGrow: 1,
});

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
}));

const Title = styled(Typography)({
  flexGrow: 1,
});

type NavBarBackProps = {
  title: string,
  childComp?: ReactNode
}

const NavBarBack: FC<NavBarBackProps> = ({title, childComp}) => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1);
  }

  return (
    <Root>
      <AppBar position="static">
        <Toolbar>
          <MenuButton 
            edge="start" 
            color="inherit" 
            aria-label="back"
            onClick={handleBackClick}>
              <ArrowBackIosIcon/>
          </MenuButton>
          <Title variant="h6">
            {title}
          </Title>
          {childComp}
        </Toolbar>
      </AppBar>
    </Root>
  );
}

export default NavBarBack;
