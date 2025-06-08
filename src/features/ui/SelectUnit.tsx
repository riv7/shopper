import { alpha, styled } from '@mui/material/styles';
import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React, { FC } from 'react';

const StyledFormControl = styled(FormControl)(({ theme }) => ({
  backgroundColor: alpha(theme.palette.common.white, 0.1)
}));

type SelectUnitProps = {
    unitState: [string, React.Dispatch<React.SetStateAction<string>>];
    valueChangedState?: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
}

const SelectUnit:FC<SelectUnitProps> = ({unitState, valueChangedState}) => {
    const [templateUnit, setTemplateUnit] = unitState;
    const [valueChanged, setValueChanged] = (valueChangedState !== undefined) ? valueChangedState : [];

    const handleSelectChange = (event:any) => {
        setTemplateUnit(event.target.value);
        if (setValueChanged !== undefined) {
          setValueChanged(true);
        }
    };

    return (
        valueChangedState !== undefined ? (
          <FormControl 
            fullWidth 
            variant="filled">
            <InputLabel id="unit-label">unit</InputLabel>
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
        ) : (
          <StyledFormControl 
            fullWidth 
            variant="standard">
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
          </StyledFormControl>
        )
      );
}

export default SelectUnit;
