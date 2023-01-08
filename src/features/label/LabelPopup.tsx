import React, { FC, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import { Avatar, Chip, ListItemAvatar, ListItemIcon, ListItemText } from '@material-ui/core';
import { fetchLabels, initLabelListener, Label, labels, labelsLoaded } from './labelSlice';
import AddIcon from '@material-ui/icons/Add';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../app/store';
import { activeTeam, Team } from '../team/teamSlice';
import InfoIcon from '@material-ui/icons/Info';

// const emails = ['username@gmail.com', 'user02@gmail.com'];
const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      justifyContent: 'center',
      flexWrap: 'wrap',
      '& > *': {
        margin: theme.spacing(0.5),
      },
    },
    root2: {
      width: '100%',
      maxWidth: 360,
      backgroundColor: theme.palette.background.paper,
    },
    root3: {
      flexGrow: 1,
      justifyContent: 'center',
      marginTop: '25px'
    },
  }));

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

  const classes = useStyles();
  const allLabels: Label[] = useSelector(labels);
  const loaded: boolean = useSelector(labelsLoaded);
  const dispatch = useAppDispatch();
  const history = useHistory();
  const actTeam: Team | undefined = useSelector(activeTeam);

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

  const handleAddLabelClick = () => {
    history.push('../label/newLabel');
  }

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
