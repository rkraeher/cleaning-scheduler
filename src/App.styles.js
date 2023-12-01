import styled from 'styled-components';
import { Frame as React95Frame } from 'react95';

export const Container = styled(React95Frame)`
  main {
    display: flex;
    flex-direction: column;
    width: 40vw;

    @media (max-width: 768px) {
      width: 60vw;
    }
  }

  & * {
    margin: 0.5rem;
  }
`;

export const Footer = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  width: 100%;
  height: 3rem;

  border-style: solid;
  border-width: 2px;
  border-left-color: #dfdfdf;
  border-top-color: #dfdfdf;
  border-right-color: #0a0a0a;
  border-bottom-color: #0a0a0a;
  box-shadow: 4px 4px 10px 0 rgba(0, 0, 0, 0.35), inset 1px 1px 0px 1px #fefefe,
    inset -1px -1px 0 1px #848584;
  box-sizing: border-box;
`;

export const Title = styled.h1`
  align-self: center;
  font-weight: bold;
`;
