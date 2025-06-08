import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Label, labelById, updateLabel } from './labelSlice';
import { useParams } from 'react-router-dom';
import NewEditLabel from './NewEditLabel';

type EditLabelRouteParams = {
  labelId: string;
}

const EditLabel: FC = (): ReactElement => {

    const { labelId } = useParams<EditLabelRouteParams>();
    const label: Label | undefined = useSelector(labelById(labelId || ''));

    return (
      <NewEditLabel
        title="Edit shop"
        header="Change shop name..."
        label={label}
        thunkAction={updateLabel} />
    );
};

export default EditLabel;
