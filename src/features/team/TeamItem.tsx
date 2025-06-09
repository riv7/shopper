import React, { FC, ReactElement } from 'react';
import { styled, alpha } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Menu, MenuItem } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import { activeTeam, copyToClipboard, removeTeam, setTeamActive, Team } from './teamSlice';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { showMessage } from '../message/messageSlice';
import {CopyToClipboard} from 'react-copy-to-clipboard';

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

const StyledTypography = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.75),
  fontSize: '1.1rem',
  maxWidth: "19ch"
}));

const StyledTypographyLight = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.secondary.main, 0.75),
  fontSize: '1.1rem',
  maxWidth: "19ch"
}));

type TeamItemProps = {
    team: Team
}

const TeamItem: FC<TeamItemProps> = ({team}): ReactElement => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const actTeam: Team | undefined = useSelector(activeTeam);
  
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const isActiveTeam = actTeam && team.id === actTeam.id;

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = () => {
    dispatch(removeTeam(team));
  }

  const handleEdit = () => {
    navigate(`/team/edit/${team.id}`)
  }

  const copyText = (teamId: string, teamPassword: string) =>  `You have been invited to use the shopper app. Please visit https://shopper.zapto.org/team/join on your PC or mobile phone.\n\nPaste the following credentials in the join team dialog.\n\nTeam ID: ${teamId} | Team PW: ${teamPassword}\n\nHappy shopping!`

  const handleDispatchMessage = () => {
     dispatch(showMessage({ status: "success", message: "Copy to clipboard successfull.\nPlease send them to your shopping mate to join." }));
  }

  const handleSelect = () => {
    dispatch(setTeamActive(team))
    // history.push('/');
  }

  return (
    <Card>
        <Grid container spacing={0} alignItems="center">
            <Grid sx={{ width: '48px', display: 'flex', justifyContent: 'center' }}>
              <IconButton aria-label="team" onClick={handleSelect}>
                {isActiveTeam ? <RadioButtonCheckedIcon /> : <RadioButtonUncheckedIcon />}
              </IconButton>
            </Grid>
            <Grid sx={{ flexGrow: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'normal', wordWrap: 'break-word' }}>
              {isActiveTeam ? 
                <StyledTypographyLight variant="h6">
                  {team.name + " (active)"}
                </StyledTypographyLight> : 
                <StyledTypography variant="h6">
                  {team.name}
                </StyledTypography>
              }
            </Grid>
            <Grid sx={{ pr: 1 }}>
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
                <MenuItem onClick={handleEdit}>
                  <IconButton
                    aria-label="team-edit"
                    color="inherit">
                    <EditIcon />
                  </IconButton>
                  Edit
                </MenuItem>
                <CopyToClipboard text={copyText(team.id, team.password)}>
                    <MenuItem onClick={handleDispatchMessage}>
                      <IconButton
                        aria-label="team-copy"
                        color="inherit">
                        <FileCopyIcon />
                      </IconButton>
                      Copy credentials
                    </MenuItem>
                </CopyToClipboard>
                <MenuItem onClick={handleDelete}>
                  <IconButton
                    aria-label="team-delete"
                    color="inherit">
                    <DeleteIcon />
                  </IconButton>
                  Delete
                </MenuItem>
              </Menu>
            </Grid>
        </Grid>
    </Card>
  );
}

export default TeamItem;
