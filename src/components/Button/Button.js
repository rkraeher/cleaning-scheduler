// * This whole module is jst taken from the react95 package so I could use the styles on label element instead of button

import styled, { css } from 'styled-components';

const blockSizes = {
  sm: '28px',
  md: '36px',
  lg: '44px',
};

const shadow = '4px 4px 10px 0 rgba(0, 0, 0, 0.35)';
const insetShadow = 'inset 2px 2px 3px rgba(0,0,0,0.2)';
const createDisabledTextStyles = () => css`
  -webkit-text-fill-color: ${({ theme }) => theme.materialTextDisabled};
  color: ${({ theme }) => theme.materialTextDisabled};
  text-shadow: 1px 1px ${({ theme }) => theme.materialTextDisabledShadow};
  /* filter: grayscale(100%); */
`;
const createBoxStyles = ({
  background = 'material',
  color = 'materialText',
} = {}) => css`
  box-sizing: border-box;
  display: inline-block;
  background: ${({ theme }) => theme[background]};
  color: ${({ theme }) => theme[color]};
`;
const createHatchedBackground = ({
  mainColor = 'black',
  secondaryColor = 'transparent',
  pixelSize = 2,
}) => css`
  background-image: ${[
    `linear-gradient(
      45deg,
      ${mainColor} 25%,
      transparent 25%,
      transparent 75%,
      ${mainColor} 75%
    )`,
    `linear-gradient(
      45deg,
      ${mainColor} 25%,
      transparent 25%,
      transparent 75%,
      ${mainColor} 75%
    )`,
  ].join(',')};
  background-color: ${secondaryColor};
  background-size: ${`${pixelSize * 2}px ${pixelSize * 2}px`};
  background-position: 0 0, ${`${pixelSize}px ${pixelSize}px`};
`;
const createFlatBoxStyles = () => css`
  position: relative;
  box-sizing: border-box;
  display: inline-block;
  color: ${({ theme }) => theme.materialText};
  background: ${({ $disabled, theme }) =>
    $disabled ? theme.flatLight : theme.canvas};
  border: 2px solid ${({ theme }) => theme.canvas};
  outline: 2px solid ${({ theme }) => theme.flatDark};
  outline-offset: -4px;
`;
const borderStyles = {
  button: {
    topLeftOuter: 'borderLightest',
    topLeftInner: 'borderLight',
    bottomRightInner: 'borderDark',
    bottomRightOuter: 'borderDarkest',
  },
  buttonPressed: {
    topLeftOuter: 'borderDarkest',
    topLeftInner: 'borderDark',
    bottomRightInner: 'borderLight',
    bottomRightOuter: 'borderLightest',
  },
  buttonThin: {
    topLeftOuter: 'borderLightest',
    topLeftInner: null,
    bottomRightInner: null,
    bottomRightOuter: 'borderDark',
  },
  buttonThinPressed: {
    topLeftOuter: 'borderDark',
    topLeftInner: null,
    bottomRightInner: null,
    bottomRightOuter: 'borderLightest',
  },
  field: {
    topLeftOuter: 'borderDark',
    topLeftInner: 'borderDarkest',
    bottomRightInner: 'borderLight',
    bottomRightOuter: 'borderLightest',
  },
  grouping: {
    topLeftOuter: 'borderDark',
    topLeftInner: 'borderLightest',
    bottomRightInner: 'borderDark',
    bottomRightOuter: 'borderLightest',
  },
  status: {
    topLeftOuter: 'borderDark',
    topLeftInner: null,
    bottomRightInner: null,
    bottomRightOuter: 'borderLightest',
  },
  window: {
    topLeftOuter: 'borderLight',
    topLeftInner: 'borderLightest',
    bottomRightInner: 'borderDark',
    bottomRightOuter: 'borderDarkest',
  },
};
const createInnerBorderWithShadow = ({
  theme,
  topLeftInner,
  bottomRightInner,
  hasShadow = false,
  hasInsetShadow = false,
}) =>
  [
    hasShadow ? shadow : false,
    hasInsetShadow ? insetShadow : false,
    topLeftInner !== null
      ? `inset 1px 1px 0px 1px ${theme[topLeftInner]}`
      : false,
    bottomRightInner !== null
      ? `inset -1px -1px 0 1px ${theme[bottomRightInner]}`
      : false,
  ]
    .filter(Boolean)
    .join(', ');
const createBorderStyles = ({ invert = false, style = 'button' } = {}) => {
  const borders = {
    topLeftOuter: invert ? 'bottomRightOuter' : 'topLeftOuter',
    topLeftInner: invert ? 'bottomRightInner' : 'topLeftInner',
    bottomRightInner: invert ? 'topLeftInner' : 'bottomRightInner',
    bottomRightOuter: invert ? 'topLeftOuter' : 'bottomRightOuter',
  };
  return css`
    border-style: solid;
    border-width: 2px;
    border-left-color: ${({ theme }) =>
      theme[borderStyles[style][borders.topLeftOuter]]};
    border-top-color: ${({ theme }) =>
      theme[borderStyles[style][borders.topLeftOuter]]};
    border-right-color: ${({ theme }) =>
      theme[borderStyles[style][borders.bottomRightOuter]]};
    border-bottom-color: ${({ theme }) =>
      theme[borderStyles[style][borders.bottomRightOuter]]};
    box-shadow: ${({ theme, shadow: hasShadow }) =>
      createInnerBorderWithShadow({
        theme,
        topLeftInner: borderStyles[style][borders.topLeftInner],
        bottomRightInner: borderStyles[style][borders.bottomRightInner],
        hasShadow,
      })};
  `;
};
const focusOutline = () => css`
  outline: 2px dotted ${({ theme }) => theme.materialText};
`;

const commonButtonStyles = css`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: ${({ size = 'md' }) => blockSizes[size]};
  width: ${({ fullWidth, size = 'md', square }) =>
    fullWidth ? '100%' : square ? blockSizes[size] : 'auto'};
  padding: ${({ square }) => (square ? 0 : `0 10px`)};
  font-size: 1rem;
  user-select: none;
  &:active {
    padding-top: ${({ disabled }) => !disabled && '2px'};
  }
  padding-top: ${({ active, disabled }) => active && !disabled && '2px'};
  &:after {
    content: '';
    position: absolute;
    display: block;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
  }
  &:not(:disabled) {
    cursor: pointer;
  }
  font-family: inherit;
`;
export const Button = styled.label`
  ${({ active, disabled, primary, theme, variant }) =>
    variant === 'flat'
      ? css`
          ${createFlatBoxStyles()}
          ${primary
            ? `
          border: 2px solid ${theme.checkmark};
            outline: 2px solid ${theme.flatDark};
            outline-offset: -4px;
          `
            : `
          border: 2px solid ${theme.flatDark};
            outline: 2px solid transparent;
            outline-offset: -4px;
          `}
          &:focus:after, &:active:after {
            ${!active && !disabled && focusOutline}
            outline-offset: -4px;
          }
        `
      : variant === 'menu' || variant === 'thin'
      ? css`
          ${createBoxStyles()};
          border: 2px solid transparent;
          &:hover,
          &:focus {
            ${!disabled &&
            !active &&
            createBorderStyles({ style: 'buttonThin' })}
          }
          &:active {
            ${!disabled && createBorderStyles({ style: 'buttonThinPressed' })}
          }
          ${active && createBorderStyles({ style: 'buttonThinPressed' })}
          ${disabled && createDisabledTextStyles()}
        `
      : css`
          ${createBoxStyles()};
          border: none;
          ${disabled && createDisabledTextStyles()}
          ${active
            ? createHatchedBackground({
                mainColor: theme.material,
                secondaryColor: theme.borderLightest,
              })
            : ''}
          &:before {
            box-sizing: border-box;
            content: '';
            position: absolute;
            ${primary
              ? css`
                  left: 2px;
                  top: 2px;
                  width: calc(100% - 4px);
                  height: calc(100% - 4px);
                  outline: 2px solid ${theme.borderDarkest};
                `
              : css`
                  left: 0;
                  top: 0;
                  width: 100%;
                  height: 100%;
                `}

            ${active
              ? createBorderStyles({
                  style: variant === 'raised' ? 'window' : 'button',
                  invert: true,
                })
              : createBorderStyles({
                  style: variant === 'raised' ? 'window' : 'button',
                  invert: false,
                })}
          }
          &:active:before {
            ${!disabled &&
            createBorderStyles({
              style: variant === 'raised' ? 'window' : 'button',
              invert: true,
            })}
          }
          &:focus:after,
          &:active:after {
            ${!active && !disabled && focusOutline}
            outline-offset: -8px;
          }
          &:active:focus:after,
          &:active:after {
            top: ${active ? '0' : '1px'};
          }
        `}
  ${commonButtonStyles}
`;
