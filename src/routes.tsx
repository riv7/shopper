import { FC, ReactElement } from "react";
import {Redirect, Route, Switch} from 'react-router-dom';
import ArticleOverview from "./features/article/ArticleOverview";
import ConfirmTeam from "./features/team/ConfirmTeam";
import SelectOrCreateTeam from "./features/team/SelectOrCreateTeam";
import SelectTeam2 from "./features/team/SelectTeam2";
import TemplateOverview from "./features/template/TemplateOverview";
import EditTemplate from "./features/template/EditTemplate";
import EditArticle from "./features/article/EditArticle";
import TeamOverview from "./features/team/TeamOverview";
import CreateTeam from "./features/team/CreateTeam";
import EditTeam from "./features/team/EditTeam";
import JoinTeam from "./features/team/JoinTeam";
import LabelPopup from "./features/label/LabelPopup";
import NewLabel from "./features/label/NewLabel";
import EditLabel from "./features/label/EditLabel";
import LabelOverview from "./features/label/LabelOverview";

const Routes: FC = (): ReactElement => {
    
    return (
        <Switch>
            <Route exact path="/">
                <Redirect to="/articles/labels/all" />
            </Route>
            <Route exact path="/articles/labels/:labelId" component={ArticleOverview} />
            <Route exact path="/articles/editArticle/:articleId" component={EditArticle} />
            <Route exact path="/label" component={LabelPopup} />
            <Route exact path="/label/manage" component={LabelOverview} />
            <Route exact path="/label/add" component={NewLabel} />
            <Route exact path="/label/editLabel/:labelId" component={EditLabel} />
            <Route exact path="/team" component={SelectOrCreateTeam} />
            <Route exact path="/team/select" component={SelectTeam2} />
            <Route exact path="/team/select2" component={TeamOverview} />
            <Route exact path="/team/create" component={CreateTeam} />
            <Route exact path="/team/edit/:teamId" component={EditTeam} />
            <Route exact path="/team/join" component={JoinTeam} />
            <Route exact path="/team/confirm" component={ConfirmTeam} />
            <Route exact path="/templates/:labelId" component={TemplateOverview} />
            <Route exact path="/templates/editTemplate/:templateId" component={EditTemplate} />

        </Switch>
    )
}

export default Routes;
