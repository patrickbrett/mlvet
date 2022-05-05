import { styled, Stack, Box, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import { makeProjectWithoutMedia } from 'renderer/util';
import { projectCreated } from 'renderer/store/actions';
import colors from '../../colors';
import { Project } from '../../../sharedTypes';
import ModalTitle from '../ModalTitle';
import StandardButton from '../StandardButton';

interface Props {
  closeModal: () => void;
  nextView: () => void;
}

const CustomStack = styled(Stack)`
  width: 100%;
`;

const CustomTextField = styled(TextField)`
  color: ${colors.white};
`;

const Container = styled(Box)`
  background-color: ${colors.grey[700]};
  height: 200px;
`;

const NewProjectView = ({ closeModal, nextView }: Props) => {
  const [projName, setProjName] = useState<string>('');
  const [isAwaitingProjectName, setIsAwaitingProjectName] =
    useState<boolean>(true);

  const dispatch = useDispatch();

  const setProjectInStore = async (project: Project) => {
    dispatch(projectCreated(project));
  };

  const handleContinue = async () => {
    const project = await makeProjectWithoutMedia(projName);
    if (project === null) {
      return;
    }
    setProjectInStore(project);
    nextView();
  };

  const handleProjectNameInput = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setProjName(event.target.value);
    if (event.target.value !== '') {
      setIsAwaitingProjectName(false);
    } else {
      setIsAwaitingProjectName(true);
    }
  };

  const continueButton = (
    <StandardButton
      color="primary"
      onClick={handleContinue}
      disabled={isAwaitingProjectName}
    >
      Continue
    </StandardButton>
  );

  const cancelButton = (
    <StandardButton color="secondary" onClick={closeModal}>
      Cancel
    </StandardButton>
  );

  return (
    <Container>
      <CustomStack
        direction="column"
        alignItems="flex-start"
        justifyContent="space-between"
        sx={{ height: '100%' }}
      >
        <CustomStack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <ModalTitle>New Project</ModalTitle>
          <Box onClick={closeModal}>
            <CloseIcon sx={{ color: colors.yellow[500], fontSize: 36 }} />
          </Box>
        </CustomStack>
        <CustomStack>
          <CustomTextField
            id="standard-basic"
            label="Project Name"
            variant="standard"
            value={projName}
            onChange={(event) => handleProjectNameInput(event)}
          />
        </CustomStack>
        <CustomStack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          {cancelButton}
          {continueButton}
        </CustomStack>
      </CustomStack>
    </Container>
  );
};

export default NewProjectView;
