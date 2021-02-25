import React, { FC, ReactElement } from "react";
import {Route, Switch} from 'react-router-dom';
import NewShop from "./features/shop/NewShop";
import Shops from "./features/shop/Shops";
import SquadOption from "./features/squad/SquadOption";

const Routes: FC = (): ReactElement => {

    return (
        <Switch>
            <Route exact path="/" component={Shops} />
            <Route exact path="/squad" component={SquadOption} />
            <Route exact path="/shops/newShop" component={NewShop} />
        </Switch>
    )
}

export default Routes;
