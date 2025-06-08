import { Button, Container, Grid } from "@mui/material";
import { styled } from "@mui/material/styles";
import React, { FC, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import NavBarBack from "../ui/NavBarBack";

const Root = styled('div')(() => ({
  flexGrow: 1,
  marginTop: '50px'
}));

const StyledButton = styled(Button)(() => ({
  textAlign: 'center',
}));

const SelectOrCreateTeam: FC = (): ReactElement => {
  const navigate = useNavigate();

  const handleCreateClick = () => {
    navigate('team/create', { replace: true });
  }
  
  const handleSelectClick = () => {
    navigate('team/select');
  }

  return (
    <div>
      <NavBarBack title="Select or create team" />
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
                  <Button 
                    variant="contained" 
                    color="secondary" 
                    onClick={handleSelectClick}
                    sx={{ textAlign: 'center' }}>
                    Select team
                  </Button>
                </Grid>
                <Grid>
                  <Button 
                    variant="contained"
                    color="secondary"
                    onClick={handleCreateClick}
                    sx={{ textAlign: 'center' }}>
                    Create team
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Root>
      </Container>
    </div>
  );
}

export default SelectOrCreateTeam;
