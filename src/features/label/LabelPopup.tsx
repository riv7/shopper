import React, { FC } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Chip, ListItemIcon, ListItemText } from '@material-ui/core';
import { Label, labels } from './labelSlice';
import { useSelector } from 'react-redux';
import InfoIcon from '@material-ui/icons/Info';

// const emails = ['username@gmail.com', 'user02@gmail.com'];

// type LabelOverviewProps = {
//     article: Article
// }

// const labels = [
//     { id: "0", name: 'basic1', color: '#000', teamId: "123" },
//     { id: "1", name: 'baasic2', color: '#000', teamId: "123" }
// ]

type LabelPopupProps = {
  selectedLabel: Label
  open: boolean
  onClose: (label: Label) => void;
}

const LabelPopup: FC<LabelPopupProps> = ({selectedLabel, open, onClose}) => {

  const allLabels: Label[] = useSelector(labels);

  // useEffect(() => {

  //   // Fetch async data only when data is not yet loaded
  //   const fetchAndInit = async () => {
  //     if (actTeam) {
  //       await dispatch(initLabelListener(actTeam!.id));
  //       await dispatch(fetchLabels(actTeam!.id));
  //     }
  //   }
  //   fetchAndInit();    
  // }, [actTeam, dispatch])


  const handleDeleteChip = () => {
    console.info('You clicked the delete icon.');
  };

  const handleClose = () => {
    onClose(selectedLabel);
    // onClose(selectedValue);
  };

  const handleLabelClick = (label: Label) => {
    onClose(label);
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
                onClick={() => handleLabelClick(label)}
                onDelete={handleDeleteChip} />
          </ListItem>
        ))}
        <ListItem>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          {/* <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar> */}
          <ListItemText primary="Add more labels in sidebar" />
        </ListItem>
        {/* <ListItem autoFocus button onClick={handleAddLabelClick}>
          <ListItemAvatar>
            <Avatar>
              <AddIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary="Add label" />
        </ListItem> */}
      </List>

    </Dialog>
  );
}

export default LabelPopup;
