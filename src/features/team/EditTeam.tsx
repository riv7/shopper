import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import CreateEditTeam from './CreateEditTeam';
import { Team, teamById, updateTeam } from './teamSlice';

type EditTeamRouteParams = {
  teamId: string;
}

const EditTeam: FC = (): ReactElement => {

    const { teamId = '' } = useParams<EditTeamRouteParams>();
    const team: Team | undefined = useSelector(teamById(teamId));

    return (
      <CreateEditTeam
        title="Edit team"
        team={team}
        thunkAction={updateTeam} />
    );
};

export default EditTeam;
