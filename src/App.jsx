import { FileImportExport } from './components/FileImportExport';
import { ThemeProvider } from 'styled-components';
import * as Shared from './styles/global';
import * as S from './App.styles';
import original from 'react95/dist/themes/original';

export default function App() {
  return (
    <>
      <Shared.GlobalStyles />
      <ThemeProvider theme={original}>
        <S.Container variant='outside' shadow>
          <main>
            <S.Title>Cleaning Calculator</S.Title>
            <FileImportExport />
          </main>
        </S.Container>
      </ThemeProvider>
    </>
  );
}
