import React, { FC, ReactElement } from "react";
import {Route, Switch} from 'react-router-dom';
import Shops from "./features/shopper/Shops";

const Routes: FC = (): ReactElement => {

    return (
        <Switch>
            <Route exact path="/" component={Shops} />
        </Switch>
    )
}

export default Routes;
