import { CircularProgress, styled } from '@material-ui/core';
import React from 'react';

const SpinnerComponent = styled(CircularProgress)`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export const Spinner = () => {
  return <SpinnerComponent />;
};
