import React, { FC } from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { Avatar, Chip, ListItemAvatar, ListItemIcon, ListItemText } from '@mui/material';
import { Label, labels } from './labelSlice';
import { useSelector } from 'react-redux';
import InfoIcon from '@mui/icons-material/Info';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';


type LabelPopupProps = {
  selectedLabel: Label;
  open: boolean;
  onClose: (label: Label) => void;
  onAddLabel: () => void;
}

const LabelPopup: FC<LabelPopupProps> = ({selectedLabel, open, onClose, onAddLabel}) => {

  const allLabels: Label[] = useSelector(labels);

  const handleClose = () => {
    onClose(selectedLabel);
    // onClose(selectedValue);
  };

  const handleLabelClick = (label: Label) => {
    onClose(label);
  };

  const handleAddLabelClick = () => {
    onAddLabel();
    //history.push('../../label/add');
  };


  return (
    <Dialog onClose={handleClose} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">Choose or add label</DialogTitle>
      <List>
        {allLabels.map((label) => (
          <ListItem key={label.id}>
            <Chip
                label={label.name}
                sx={{ backgroundColor: `${label.color}` }}
                onClick={() => handleLabelClick(label)} />
          </ListItem>
        ))}
        <ListItem autoFocus onClick={handleAddLabelClick}>
          <ListItemIcon>
            <AddCircleOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Add new label" />
        </ListItem>
      </List>

    </Dialog>
  );
}

export default LabelPopup;
