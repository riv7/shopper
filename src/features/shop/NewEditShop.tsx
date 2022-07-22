import { Container, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBarBack from '../ui/NavBarBack';
import { Team, activeTeam } from '../team/teamSlice';
import { useHistory } from 'react-router-dom';
import { AppAsyncThunk } from '../../app/store';
import { Shop } from './shopSlice';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '50px'
    },
    textInput: {
      marginLeft: '5px'
    }
  })
);

type NewEditShopProps = {
  title: string;
  label: string;
  shop?: Shop;
  thunkAction: AppAsyncThunk;
}

const NewEditShop: FC<NewEditShopProps> = ({title, label, shop, thunkAction}): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();
    const actTeam: Team | undefined = useSelector(activeTeam);
    const history = useHistory();
    const [shopName, setShopName] = useState(shop === undefined ? '' : shop.name);
    const [nameChanged, setNameChanged] = useState(false);
    
    const handleSaveClick = () => {
        const changedShop = {
          id: shop === undefined ? '' : shop.id,
          name: shopName,
          teamId: actTeam!.id
        }
        dispatch(thunkAction(changedShop));
        history.goBack();
    }

    const SaveButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="save"
        disabled={nameChanged === false}
        onClick={handleSaveClick}>
        <SaveIcon />
      </IconButton>;

    return (
      <div>
        <NavBarBack 
          title={title}
          childComp={<SaveButton/>} />
        <Container>
          <form>
            <div className={classes.root}>
              <Grid
                container
                justify="center"
                alignItems="flex-start"
                spacing={0}
                style={{ minHeight: '100vh' }}
                direction="row">

                <Grid
                  container
                  justify="center"
                  direction="column"
                  spacing={3}>
                  <Grid item>
                    <TextField 
                      id="shop-name" 
                      label={label}
                      variant="outlined"
                      fullWidth 
                      value={shopName}
                      onChange={event => {
                        setShopName(event.target.value);
                        setNameChanged(true)}}/>
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </form>
        </Container>
      </div>
    );
};

export default NewEditShop;
