import React, { FC, ReactElement } from "react";
import {Route, Switch} from 'react-router-dom';
import ArticleOverview from "./features/article/ArticleOverview";
import ConfirmTeam from "./features/team/ConfirmTeam";
import CreateEditTeam from "./features/team/CreateEditTeam";
import SelectOrCreateTeam from "./features/team/SelectOrCreateTeam";
import SelectTeam2 from "./features/team/SelectTeam2";
import ShopOverview from "./features/shop/ShopOverview";
import NewShop from "./features/shop/NewShop";
import EditShop from "./features/shop/EditShop";
import TemplateOverview from "./features/template/TemplateOverview";
import EditTemplate from "./features/template/EditTemplate";
import EditArticle from "./features/article/EditArticle";
import TeamOverview from "./features/team/TeamOverview";
import CreateTeam from "./features/team/CreateTeam";
import EditTeam from "./features/team/EditTeam";
import JoinTeam from "./features/team/JoinTeam";
import LabelOverview from "./features/label/LabelOverview";
import NewLabel from "./features/label/NewLabel";

const Routes: FC = (): ReactElement => {
    
    return (
        <Switch>
            <Route exact path="/" component={ShopOverview} />
            <Route exact path="/label" component={LabelOverview} />
            <Route exact path="/label/newLabel" component={NewLabel} />
            <Route exact path="/shop" component={ShopOverview} />
            <Route exact path="/shop/newShop" component={NewShop} />
            <Route exact path="/shop/editShop/:shopId" component={EditShop} />
            <Route exact path="/team" component={SelectOrCreateTeam} />
            <Route exact path="/team/select" component={SelectTeam2} />
            <Route exact path="/team/select2" component={TeamOverview} />
            <Route exact path="/team/create" component={CreateTeam} />
            <Route exact path="/team/edit/:teamId" component={EditTeam} />
            <Route exact path="/team/join" component={JoinTeam} />
            <Route exact path="/team/confirm" component={ConfirmTeam} />
            {/* <Route exact path="/articles/newArticle/:shopId" component={NewArticle} /> */}
            <Route exact path="/articles/:shopId/labels/:labelId" component={ArticleOverview} />
            <Route exact path="/articles/editArticle/:articleId" component={EditArticle} />
            <Route exact path="/templates/:shopId" component={TemplateOverview} />
            <Route exact path="/templates/editTemplate/:templateId" component={EditTemplate} />
        </Switch>
    )
}

export default Routes;
