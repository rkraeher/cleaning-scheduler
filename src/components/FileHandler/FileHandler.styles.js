import styled from 'styled-components';
import { Button } from '../Button/Button';
import {
  Button as React95Button,
  Separator as React95Separator,
} from 'react95';

export const Container = styled.div`
  section {
    display: flex;
  }

  & > section:last-child {
    margin-left: 1rem;
    margin-right: 1rem;
  }
`;

export const DownloadButton = styled(React95Button)`
  width: 50%;
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

export const SeparatorContainer = styled.div`
  display: grid;
`;

export const Separator = styled(React95Separator)`
  justify-self: center;
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
