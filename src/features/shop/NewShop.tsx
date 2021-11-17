import React, { FC, ReactElement } from 'react';
import { addShop } from './shopSlice';
import NewEditShop from './NewEditShop';

const NewShop: FC = (): ReactElement => {

  return (
    <NewEditShop
      title="New Shop"
      label="Enter new shop name..."
      thunkAction={addShop} />
  );
}

export default NewShop;
