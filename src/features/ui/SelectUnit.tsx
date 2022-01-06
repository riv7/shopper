import { alpha, createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme } from '@material-ui/core';
import React, { FC } from 'react';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      backgroundColor: alpha(theme.palette.common.white, 0.1)
    }
  }),
);

type SelectUnitProps = {
    unitState: [string, React.Dispatch<React.SetStateAction<string>>];
    valueChangedState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const SelectUnit:FC<SelectUnitProps> = ({unitState, valueChangedState}) => {

    const classes = useStyles();
    const [templateUnit, setTemplateUnit] = unitState;
    const [valueChanged, setValueChanged] = (valueChangedState !== undefined) ? valueChangedState : [];

    const handleSelectChange = (event:any) => {
        setTemplateUnit(event.target.value);
        if (setValueChanged !== undefined) {
          setValueChanged(true);
        }
    };

    return (
        <FormControl 
          fullWidth 
          variant ={(valueChangedState !== undefined) ? "filled": "standard"}
          className ={(valueChangedState !== undefined) ? "": classes.formControl} >
          {(valueChangedState !== undefined) && <InputLabel id="unit-label">unit</InputLabel>}
          <Select
            fullWidth
            labelId="unit-label"
            id="unit-select"
            value={templateUnit}
            onChange={handleSelectChange}>
            <MenuItem value={"piece"}>piece</MenuItem>
            <MenuItem value={"g"}>gram</MenuItem>
            <MenuItem value={"l"}>liter</MenuItem>
            <MenuItem value={"kg"}>kilo</MenuItem>
          </Select>
        </FormControl>
      );
}

export default SelectUnit;
