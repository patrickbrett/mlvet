import os from 'os';
import { OperatingSystems } from '../../sharedTypes';

type HandleOsQuery = () => OperatingSystems | null;

const handleOsQuery: HandleOsQuery = () => {
  const isDarwin = os.platform() === OperatingSystems.MACOS;
  const isWindows = os.platform() === OperatingSystems.WINDOWS;
  const isLinux = os.platform() === OperatingSystems.LINUX;

  if (isDarwin) {
    return OperatingSystems.MACOS;
  }
  if (isWindows) {
    return OperatingSystems.WINDOWS;
  }
  if (isLinux) {
    return OperatingSystems.LINUX;
  }

  return null;
};

export default handleOsQuery;
