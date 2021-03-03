import React, { FC, ReactElement } from "react";
import {Route, Switch} from 'react-router-dom';
import NewShop from "./features/shop/NewShop";
import Shops from "./features/shop/Shops";
import CreateTeam from "./features/team/CreateTeam";
import SelectOrCreateTeam from "./features/team/SelectOrCreateTeam";

const Routes: FC = (): ReactElement => {

    return (
        <Switch>
            <Route exact path="/" component={Shops} />
            <Route exact path="/team" component={SelectOrCreateTeam} />
            <Route exact path="/team/create" component={CreateTeam} />
            <Route exact path="/shops/newShop" component={NewShop} />
        </Switch>
    )
}

export default Routes;
