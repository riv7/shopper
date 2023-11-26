import { Chip, Container, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBarBack from '../ui/NavBarBack';
import { Team, activeTeam } from '../team/teamSlice';
import { useHistory } from 'react-router-dom';
import { AppAsyncThunk } from '../../app/store';
import { Label } from './labelSlice';
import { CirclePicker } from 'react-color';
import { Color, ColorResult } from 'react-color';


const useStyles = makeStyles(() =>
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

type NewEditLabelProps = {
  title: string;
  header: string;
  label?: Label;
  thunkAction: AppAsyncThunk;
}

const colors = [
  "#f44336",
  "#e91e63",
  "#9c27b0", 
  "#673ab7", 
  "#3f51b5", 
  "#2196f3", 
  "#03a9f4", 
  "#00bcd4", 
  "#009688", 
  "#4caf50", 
  "#8bc34a", 
  "#cddc39", 
  "#ffeb3b", 
  "#ffc107", 
  "#ff9800", 
  "#ff5722", 
  "#795548", 
  "#607d8b"]

const NewEditLabel: FC<NewEditLabelProps> = ({title, header, label, thunkAction}): ReactElement => {

    const initialColor = ():string => {
      return label === undefined ? colors[Math.floor(Math.random()*colors.length)] : label.color;
    }

    const classes = useStyles();
    const dispatch = useDispatch();
    const actTeam: Team | undefined = useSelector(activeTeam);
    const history = useHistory();
    const [labelName, setLabelName] = useState(label === undefined ? '' : label.name);
    const [nameChanged, setNameChanged] = useState(false);
    const [colorChanged, setColorChanged] = useState(false);
    const [color, setColor] = useState<Color>(initialColor());
    const [switchColor, setSwitchColor] = useState(false);

    const handleSaveClick = () => {
        const changedLabel = {
          id: label === undefined ? '' : label.id,
          name: labelName,
          color: color,
          teamId: actTeam!.id
        }
        dispatch(thunkAction(changedLabel));
        history.goBack();
    }

    const handleChangeComplete = (color: ColorResult) => {
      setColorChanged(true)
      setColor(color.hex)
      setSwitchColor(false);
    };

    const handleSwitchColor = () => {
      setSwitchColor(true);
    }

    const SaveButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="save"
        disabled={(nameChanged === false && colorChanged === false) || labelName === ''}
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
                      id="label-name" 
                      label={header}
                      variant="outlined"
                      fullWidth 
                      value={labelName}
                      onChange={event => {
                        setLabelName(event.target.value);
                        setNameChanged(true)}}/>
                  </Grid>
                  <Grid item>
                    <Chip
                      label = 'Switch color of shop'
                      style = {{backgroundColor: `${color}`}}
                      onClick = {handleSwitchColor}
                    />
                  </Grid>
                  {switchColor && <Grid item >
                    <CirclePicker 
                      color={color}
                      onChangeComplete={handleChangeComplete}
                    />
                  </Grid>
                  }
                </Grid>
              </Grid>
            </div>
          </form>
        </Container>
      </div>
    );
};

export default NewEditLabel;
