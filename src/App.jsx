import { FileImportExport } from './components/FileImportExport';
import { ThemeProvider } from 'styled-components';
import * as S from './styles/global';
import original from 'react95/dist/themes/original';

export default function App() {
  return (
    <>
      <S.GlobalStyles />
      <ThemeProvider theme={original}>
        <S.Frame variant='outside' shadow>
          <h1>Cleaning Calculator</h1>
          <FileImportExport />
        </S.Frame>
      </ThemeProvider>
    </>
  );
}
