import { styled, Typography, Stack, Box, TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { ChangeEvent, useState } from 'react';
import { useDispatch } from 'react-redux';
import CancelButton from '../CancelButton';
import ActionButton from '../ActionButton';
import colors from '../../colors';
import { projectNameSubmitted } from '../../store/actions';
import { ProjectName } from '../../../sharedTypes';

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
  height: 500px;
`;

const CustomTypography = styled(Typography)`
  color: ${colors.grey[500]};
`;

const NewProjectView = ({ closeModal, nextView }: Props) => {
  const [projName, setProjName] = useState<string>('');
  const [isAwaitingProjectName, setIsAwaitingProjectName] =
    useState<boolean>(true);

  const dispatch = useDispatch();

  const setProjectNameInStore = (projectName: ProjectName) =>
    dispatch(projectNameSubmitted(projectName));

  const handleContinue = async () => {
    setProjectNameInStore({ name: projName } as ProjectName);
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
    <ActionButton onClick={handleContinue} disabled={isAwaitingProjectName}>
      Continue
    </ActionButton>
  );

  const cancelButton = <CancelButton onClick={closeModal}>Cancel</CancelButton>;

  return (
    <Container>
      <CustomStack
        direction="column"
        alignItems="flex-start"
        justifyContent="space-around"
        sx={{ height: '100%' }}
      >
        <CustomStack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <CustomTypography fontWeight="bold">New Project</CustomTypography>
          <Box onClick={closeModal}>
            <CloseIcon sx={{ color: colors.yellow[500], fontSize: 36 }} />
          </Box>
        </CustomStack>
        <CustomTextField
          id="standard-basic"
          label="Project Name"
          variant="standard"
          value={projName}
          onChange={(event) => handleProjectNameInput(event)}
        />
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
