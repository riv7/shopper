import React, { FC, ReactElement } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import {  useSelector } from 'react-redux';

import { Container } from '@material-ui/core';
import NavBarMenu from '../ui/NavBarMenu';
import LabelItem from './LabelItem';
import { Label, labels } from './labelSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '25px'
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
      color: theme.palette.text.secondary,
    },
    fab : {
      margin: 0,
      top: 'auto',
      right: 20,
      bottom: 20,
      left: 'auto',
      position: 'fixed',
    }
  }),
);

const LabelOverview: FC = (): ReactElement => {
 
  const classes = useStyles();
  const allLabels: Label[] = useSelector(labels);

  return (
    <div>
      <NavBarMenu/>
      <Container>
        <div className={classes.root}>
          <Grid container spacing={3}>
            {allLabels
              .map(label => 
                <Grid item xs={12} key={label.id}>
                  <LabelItem label={label} />
                </Grid>
              )}
          </Grid>
        </div>
      </Container>
    </div>
  );
}

export default LabelOverview;
