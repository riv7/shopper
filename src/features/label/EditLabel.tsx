import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Label, labelById, updateLabel } from './labelSlice';
import { RouteComponentProps } from 'react-router-dom';
import NewEditLabel from './NewEditLabel';

type EditLabelRouteProps = {
  labelId: string;
}

const EditShop: FC<RouteComponentProps<EditLabelRouteProps>> = ({match}): ReactElement => {

    const labelId: string = match.params.labelId;
    const label: Label | undefined = useSelector(labelById(labelId));

    return (
      <NewEditLabel
        title="Edit Label"
        header="Change label name..."
        label={label}
        thunkAction={updateLabel} />
    );
};

export default EditShop;
