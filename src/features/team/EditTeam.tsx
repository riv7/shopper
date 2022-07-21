import React, { FC, ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { RouteComponentProps } from 'react-router-dom';
import CreateEditTeam from './CreateEditTeam';
import { Team, teamById, updateTeam } from './teamSlice';

type EditTeamRouteProps = {
  teamId: string;
}

const EditTeam: FC<RouteComponentProps<EditTeamRouteProps>>= ({match}): ReactElement => {

    const teamId: string = match.params.teamId;
    const team: Team | undefined = useSelector(teamById(teamId));

    return (
      <CreateEditTeam
        title="Edit team"
        team={team}
        thunkAction={updateTeam} />
    );
};

export default EditTeam;
