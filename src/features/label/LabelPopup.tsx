import React, { FC } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Avatar, Chip, ListItemAvatar, ListItemIcon, ListItemText } from '@material-ui/core';
import { Label, labels } from './labelSlice';
import { useSelector } from 'react-redux';
import InfoIcon from '@material-ui/icons/Info';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';


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
          <ListItem>
      
            <Chip
                //   icon={icon}
                label={label.name}
                style = {{backgroundColor: `${label.color}`}}
                onClick={() => handleLabelClick(label)} />
          </ListItem>
        ))}
        <ListItem autoFocus button onClick={handleAddLabelClick}>
          <ListItemIcon>
            <AddCircleOutlineIcon />
          </ListItemIcon>
          <ListItemText primary="Add new label" />
          {/*<ListItemAvatar>
            <Avatar>
              <AddCircleOutlineIcon />
            </Avatar>
          </ListItemAvatar>
        <ListItemText primary="Add new label" />*/}
        </ListItem>
      </List>

    </Dialog>
  );
}

export default LabelPopup;
