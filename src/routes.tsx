import React, { FC, ReactElement } from "react";
import {Route, Switch} from 'react-router-dom';
import NewArticle from "./features/article/NewArticle";
import Articles from "./features/article/Article";
import ConfirmTeam from "./features/team/ConfirmTeam";
import CreateTeam from "./features/team/CreateTeam";
import SelectOrCreateTeam from "./features/team/SelectOrCreateTeam";
import SelectTeam from "./features/team/SelectTeam";
import SelectTeam2 from "./features/team/SelectTeam2";
import ShopOverview from "./features/shop/ShopOverview";
import NewShop from "./features/shop/NewShop";

const Routes: FC = (): ReactElement => {
    
    return (
        <Switch>
            <Route exact path="/" component={Articles} />
            <Route exact path="/shop" component={ShopOverview} />
            <Route exact path="/shop/newShop" component={NewShop} />
            <Route exact path="/team" component={SelectOrCreateTeam} />
            <Route exact path="/team/select" component={SelectTeam2} />
            <Route exact path="/team/create" component={CreateTeam} />
            <Route exact path="/team/confirm" component={ConfirmTeam} />
            <Route exact path="/articles/newArticle/:shopId" component={NewArticle} />
            <Route exact path="/articles/:shopId" component={Articles} />
        </Switch>
    )
}

export default Routes;
