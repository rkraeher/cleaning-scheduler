import { useEffect, useState } from 'react';
import { ProgressBar as React95ProgressBar } from 'react95';
import * as S from './ProgressBar.styles';

export const ProgressBar = () => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPercent((previousPercent) => {
        if (previousPercent === 100) {
          return 0;
        }
        const diff = Math.random() * 10;
        return Math.min(previousPercent + diff, 100);
      });
    }, 500);
    return () => {
      clearInterval(timer);
    };
  }, []);
  return (
    <S.Container>
      <React95ProgressBar value={Math.floor(percent)} />
    </S.Container>
  );
};
