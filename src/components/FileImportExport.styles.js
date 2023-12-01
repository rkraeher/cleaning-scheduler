import styled from 'styled-components';
import { Button } from './Button';

export const Container = styled.div`
  section {
    display: flex;
  }
`;

export const DownloadSection = styled.section`
  & * {
    margin-left: 0;
  }
`;

export const InvisibleInput = styled.input`
  opacity: 0;
  position: absolute;
`;

export const Text = styled.p`
  display: flex;
  justify-content: center;
  width: 50%;

  span {
    display: flex;
    align-items: center;
    margin: 0;
  }
`;

export const UploadButton = styled(Button)`
  width: 50%;
`;
