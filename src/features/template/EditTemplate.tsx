import { Container, createStyles, Grid, makeStyles, TextField, Theme } from '@material-ui/core';
import SaveIcon from '@material-ui/icons/Save';
import IconButton from '@material-ui/core/IconButton';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBarBack from '../ui/NavBarBack';
import { RouteComponentProps, useHistory } from 'react-router-dom';
import { Template, templateById, updateTemplate } from './templateSlice';
import SelectUnit from '../ui/SelectUnit';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
      marginTop: '50px'
    },
    textInput: {
      marginLeft: '5px'
    }
  })
);

type EditTemplateRouteProps = {
  templateId: string;
}

const EditTemplate: FC<RouteComponentProps<EditTemplateRouteProps>> = ({match}): ReactElement => {

    const classes = useStyles();
    const dispatch = useDispatch();

    const templateId: string = match.params.templateId;
    const template: Template | undefined = useSelector(templateById(templateId));

    const history = useHistory();
    const [templateName, setTemplateName] = useState(template === undefined ? '' : template.name);
    const unitState = useState(template === undefined ? '' : template.unit);
    const [selectedUnit] = unitState;
    const valueChangedState = useState(false);
    const [valueChanged, setValueChanged] = valueChangedState;
    
    const handleSaveClick = () => {
        const changedTemplate = {
          id: template!.id,
          name: templateName,
          unit: selectedUnit,
          global: false
        }
        dispatch(updateTemplate(changedTemplate));
        history.goBack();
    }

    const SaveButton: FC = () =>
      <IconButton 
        color="secondary"
        aria-label="save"
        disabled={valueChanged === false}
        onClick={handleSaveClick}>
        <SaveIcon />
      </IconButton>;

    return (
      <div>
        <NavBarBack 
          title="Edit template"
          childComp={<SaveButton/>} />
        <Container>
          <form>
            <div className={classes.root}>
              <Grid
                container
                justify="center"
                alignItems="flex-start"
                spacing={0}
                style={{ minHeight: '100vh' }}
                direction="row">

                <Grid
                  container
                  justify="center"
                  direction="column"
                  spacing={3}>
                  <Grid item>
                    <Grid
                      container
                      justify="space-between"
                      spacing={1}>
                        <Grid item xs={8}>
                          <TextField 
                            id="template-name" 
                            label="Change template name..."
                            variant="outlined"
                            fullWidth 
                            inputProps={{ maxlength: 12 }}
                            value={templateName}
                            onChange={event => {
                              setTemplateName(event.target.value);
                              setValueChanged(true)}}/>
                        </Grid>
                        <Grid item xs={4}>
                          <SelectUnit unitState={unitState} valueChangedState={valueChangedState} />
                        </Grid>
                      </Grid>
                    </Grid>
                </Grid>
              </Grid>
            </div>
          </form>
        </Container>
      </div>
    );
};

export default EditTemplate;
