import React, { FC, ReactElement } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import CreateEditTeam from './CreateEditTeam';
import { addTeam } from './teamSlice';


const CreateTeam: FC = (): ReactElement => {

    return (
      <CreateEditTeam
        title="Create team"
        thunkAction={addTeam} />
    );
};

export default CreateTeam;
