import { Box, styled, Typography, Stack } from '@mui/material';
import { Dispatch, SetStateAction } from 'react';
import colors from 'renderer/colors';
import ActionButton from './ActionButton';

const SelectMediaBox = styled(Box)`
  width: 100%;
`;

const InnerBox = styled(Box)`
  border-style: dashed;
  border-color: ${colors.grey[500]}
  color: ${colors.white};
  margin-top: 20px;
  padding: 20px;

  &:hover {
    cursor: pointer;
    background: ${colors.grey[600]};
  }
`;

interface Props {
  mediaFilePath: string | null;
  setMediaFilePath: Dispatch<SetStateAction<string | null>>;
  setIsAwaitingMedia: Dispatch<SetStateAction<boolean>>;
}

const SelectMediaBlock = ({
  mediaFilePath,
  setMediaFilePath,
  setIsAwaitingMedia,
}: Props) => {
  const selectMedia: () => Promise<void> = async () => {
    const selectedMedia = await window.electron.requestMediaDialog();

    if (selectMedia !== null) {
      setIsAwaitingMedia(false);
    }

    setMediaFilePath(selectedMedia);
  };

  return (
    <SelectMediaBox onClick={selectMedia}>
      <InnerBox>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: '150px' }}
        >
          <Typography fontWeight="bold">Drag and drop file here</Typography>
          <Typography fontWeight="bold">or</Typography>
          <ActionButton>Browse</ActionButton>
        </Stack>
      </InnerBox>
    </SelectMediaBox>
  );
};

export default SelectMediaBlock;
