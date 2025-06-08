import { Button, Container, Grid, IconButton, TextField } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, ReactElement, useState } from "react";
import NavBarBack from "../ui/NavBarBack";
import SendIcon from '@mui/icons-material/Send';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '50px'
}));

const StyledButton = styled(Button)(({ theme }) => ({
  textAlign: 'center',
}));

const ConfirmTeam: FC = (): ReactElement => {
  const [teamName, setTeamName] = useState('');
  const [teamPassword, setTeamPassword] = useState('');

  const handleAddClick = () => {
    // dispatch(addShop(shopName));
  }

  const SendButton: FC = () =>
    <IconButton 
      color="secondary"
      aria-label="send"
      disabled={teamName === '' || teamPassword === ''}
      onClick={handleAddClick}>
      <SendIcon />
    </IconButton>;

  return (
    <div>
      <NavBarBack title="Confirm team" childComp={<SendButton/>} />
      <Container>
        <Root>
          <Grid
            container
            justifyContent="center"
            alignItems="flex-start"
            spacing={0}
            style={{ minHeight: '100vh' }}
            direction="row">
            <Grid>
              <Grid
                container
                justifyContent="center"
                direction="column"
                spacing={3}>
                <Grid>
                  <TextField 
                    id="team-name" 
                    label="Team name ..."
                    variant="outlined"
                    fullWidth 
                    value={teamName}
                    onChange={event => setTeamName(event.target.value)}/>
                </Grid>
                <Grid>
                  <TextField 
                    id="standard-basic" 
                    label="Enter team password..."
                    variant="outlined"
                    type="password"
                    fullWidth 
                    value={teamPassword}
                    onChange={event => setTeamPassword(event.target.value)}/>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Root>
      </Container>
    </div>
  );
}

export default ConfirmTeam;
