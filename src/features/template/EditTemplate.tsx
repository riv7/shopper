import { Container, Grid, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import React, { FC, ReactElement, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NavBarBack from '../ui/NavBarBack';
import { useParams, useNavigate } from 'react-router-dom';
import { Template, templateById, updateTemplate } from './templateSlice';
import SelectUnit from '../ui/SelectUnit';

const Root = styled('div')(({ theme }) => ({
  flexGrow: 1,
  marginTop: '50px'
}));

const TextInput = styled(TextField)(({ theme }) => ({
  marginLeft: '5px'
}));

type EditTemplateRouteParams = {
  templateId: string;
}

const EditTemplate: FC = (): ReactElement => {
    const dispatch = useDispatch();

    const { templateId = '' } = useParams<EditTemplateRouteParams>();
    const template: Template | undefined = useSelector(templateById(templateId));

    const navigate = useNavigate();
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
        navigate(-1);
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
            <Root>
              <Grid
                container
                justifyContent="center"
                alignItems="flex-start"
                spacing={0}
                style={{ minHeight: '100vh' }}
                direction="row">

                <Grid
                  container
                  justifyContent="center"
                  direction="column"
                  spacing={3}>
                  <Grid>
                    <Grid
                      container
                      direction="column"
                      spacing={2}>
                        <Grid sx={{ width: '100%', mb: 2 }}>
                          <TextField 
                            id="template-name" 
                            label="Change template name..."
                            variant="outlined"
                            fullWidth 
                            inputProps={{ maxLength: 23 }}
                            value={templateName}
                            onChange={event => {
                              setTemplateName(event.target.value);
                              setValueChanged(true)}}/>
                        </Grid>
                        <Grid sx={{ width: '100%' }}>
                          <SelectUnit unitState={unitState} valueChangedState={valueChangedState} />
                        </Grid>
                      </Grid>
                    </Grid>
                </Grid>
              </Grid>
            </Root>
          </form>
        </Container>
      </div>
    );
};

export default EditTemplate;
