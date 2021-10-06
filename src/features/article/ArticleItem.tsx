import React, { FC, ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
  bullet: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)',
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

type ArticleItemProps = {
    title: string
}

const ArticleItem: FC<ArticleItemProps> = ({title}): ReactElement => {

  const classes = useStyles();

  return (
    <Card>
        <Grid container spacing={3}>
            <Grid item xs={4}>
                <CardActions>
                    <Button size="small">Done</Button>
                </CardActions>
            </Grid>
            <Grid item xs={4}>
                <CardContent>
                    <Typography variant="h5" component="h2">
                    {title}
                    </Typography>
                </CardContent>
            </Grid>
        </Grid>
    </Card>
  );
}

export default ArticleItem;
