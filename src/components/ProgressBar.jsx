import { useEffect, useState } from 'react';
import { ProgressBar as React95ProgressBar } from 'react95';
import * as S from './ProgressBar.styles';

// eslint-disable-next-line react/prop-types
export const ProgressBar = ({ isUploading, onUploadComplete, key }) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    let timer;

    const uploadFile = () => {
      timer = setInterval(() => {
        setPercent((previousPercent) => {
          if (previousPercent === 100) {
            clearInterval(timer);
            onUploadComplete();
            return 100;
          }
          const diff = Math.random() * 60;
          return Math.min(previousPercent + diff, 100);
        });
      }, 500);
    };

    if (isUploading) {
      uploadFile();
    }

    return () => {
      clearInterval(timer);
    };
  }, [isUploading, onUploadComplete, key]);

  return (
    <S.Container>
      <React95ProgressBar key={key} value={Math.floor(percent)} />
    </S.Container>
  );
};
