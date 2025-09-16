import styled from '@emotion/styled';

import type { AppTheme } from '@/theme';

export const HeaderStyled = styled.header`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  width: 100%;
  max-width: 100%;
  background: ${({ theme }) => (theme as AppTheme).colors.header};
  padding: 20px 25px;

  @media (max-width: 560px) {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`;

export const HeaderLogo = styled.h1`
  margin: 0;
  font-size: ${({ theme }) => (theme as AppTheme).font.sizes.lg};
  font-weight: 700;
  color: ${({ theme }) => (theme as AppTheme).colors.primary[500]};
  letter-spacing: 1px;
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  margin-left: auto;
  gap: 10px;
  max-width: 600px;
  justify-content: flex-end;
  width: 100%;

  @media screen and (max-width: 560px) {
    flex-direction: column;
  }
`;
