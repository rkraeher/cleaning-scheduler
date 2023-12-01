import { FileImportExport } from './components/FileImportExport';
import { ThemeProvider } from 'styled-components';
import * as Shared from './styles/global';
import * as S from './App.styles';
import original from 'react95/dist/themes/original';
import { Anchor } from 'react95';

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
        <S.Footer>
          <Anchor
            href='https://github.com/rkraeher'
            target='_blank'
            rel='noreferrer'
          >
            https://github.com/rkraeher
          </Anchor>
        </S.Footer>
      </ThemeProvider>
    </>
  );
}
