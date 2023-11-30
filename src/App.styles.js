import styled from 'styled-components';
import { Frame as React95Frame } from 'react95';

export const Container = styled(React95Frame)`
  main {
    display: flex;
    flex-direction: column;
    width: 25vw;
  }

  & * {
    margin: 0.5rem;
  }
`;

export const Title = styled.h1`
  align-self: center;
`;