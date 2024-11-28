import { useEffect, useState } from 'react';
import {
  isMobile,
  isTablet,
  isDesktop,
  browserName,
  deviceType,
  osName,
  mobileModel
} from 'react-device-detect';

interface DeviceInfo {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  deviceType: string;
  browserName: string;
  osName: string;
  mobileModel: string;
}

export const useDevice = () => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    deviceType: '',
    browserName: '',
    osName: '',
    mobileModel: ''
  });

  useEffect(() => {
    setDeviceInfo({
      isMobile,
      isTablet,
      isDesktop,
      deviceType,
      browserName,
      osName,
      mobileModel
    });
  }, []);

  return deviceInfo;
};
