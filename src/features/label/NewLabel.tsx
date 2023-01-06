import React, { FC, ReactElement } from 'react';
import { addLabel } from './labelSlice';
import NewEditLabel from './NewEditLabel';

const NewLabel: FC = (): ReactElement => {

  return (
    <NewEditLabel
      title="New Label"
      header="Enter new label name..."
      thunkAction={addLabel} />
  );
}

export default NewLabel;
