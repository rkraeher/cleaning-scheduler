import { styleReset, Frame as React95Frame } from 'react95';
import styled, { createGlobalStyle } from 'styled-components';
import windowsWallpaper from '../images/windows-wallpaper.jpeg';
import ms_sans_serif from 'react95/dist/fonts/ms_sans_serif.woff2';
import ms_sans_serif_bold from 'react95/dist/fonts/ms_sans_serif_bold.woff2';

export const GlobalStyles = createGlobalStyle`
  ${styleReset}
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif}') format('woff2');
    font-weight: 400;
    font-style: normal
  }
  @font-face {
    font-family: 'ms_sans_serif';
    src: url('${ms_sans_serif_bold}') format('woff2');
    font-weight: bold;
    font-style: normal
  }
  body, input, select, textarea {
    font-family: 'ms_sans_serif';
  }
  body {
    background-image: url(${windowsWallpaper});
    background-size: cover;
    height: 100vh;
    width: 100vw;
    margin: 0;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const Frame = styled(React95Frame)`
  display: flex;
  padding: 0.5rem;
  align-items: center;
  flex-direction: column;
`;
