import React, { FC, ReactElement } from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';
import { Container } from '@mui/material';
import LabelItem from './LabelItem';
import { Label, labels } from './labelSlice';
import NavBarBack from '../ui/NavBarBack';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '25px'
}));

const StyledPaper = styled('div')(({ theme }) => ({
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const AddFab = styled('div')(({ theme }) => ({
  margin: 0,
  top: 'auto',
  right: 20,
  bottom: 20,
  left: 'auto',
  position: 'fixed',
}));

const LabelOverview: FC = (): ReactElement => {
  const allLabels: Label[] = useSelector(labels);

  return (
    <div>
      <NavBarBack 
          title="Shops" />
      <Container>
        <Root>
          <Grid container spacing={3}>
            {allLabels
              .map(label => 
                <Grid sx={{ width: '100%' }} key={label.id}>
                  <LabelItem label={label} />
                </Grid>
              )}
          </Grid>
        </Root>
      </Container>
    </div>
  );
}

export default LabelOverview;
