import { FC, ReactElement } from "react";
import { Route, Routes as RouterRoutes, Navigate } from 'react-router-dom';
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
        <RouterRoutes>
            <Route path="/" element={<Navigate to="/articles/labels/all" replace />} />
            <Route path="/articles/labels/:labelId" element={<ArticleOverview />} />
            <Route path="/articles/editArticle/:articleId" element={<EditArticle />} />
            {/* LabelPopup requires props and is used within other components */}
            <Route path="/label/manage" element={<LabelOverview />} />
            <Route path="/label/add" element={<NewLabel />} />
            <Route path="/label/editLabel/:labelId" element={<EditLabel />} />
            <Route path="/team" element={<SelectOrCreateTeam />} />
            <Route path="/team/select" element={<SelectTeam2 />} />
            <Route path="/team/select2" element={<TeamOverview />} />
            <Route path="/team/create" element={<CreateTeam />} />
            <Route path="/team/edit/:teamId" element={<EditTeam />} />
            <Route path="/team/join" element={<JoinTeam />} />
            <Route path="/team/confirm" element={<ConfirmTeam />} />
            <Route path="/templates/:labelId" element={<TemplateOverview />} />
            <Route path="/templates/editTemplate/:templateId" element={<EditTemplate />} />
        </RouterRoutes>
    )
}

export default Routes;
