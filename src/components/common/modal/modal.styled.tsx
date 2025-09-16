import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';

import type { AppTheme } from '@/theme';

const fadeIn = keyframes`
  from { opacity: 0 }
  to { opacity: 1 }
`;

const scaleIn = keyframes`
  from { opacity: 0; transform: translateY(4px) scale(0.98) }
  to { opacity: 1; transform: translateY(0) scale(1) }
`;

export const BackdropLayer = styled.div`
  position: fixed;
  inset: 0;
  background: ${({ theme }) => ((theme as AppTheme).isDark ? 'rgba(0,0,0,.5)' : 'rgba(0,0,0,.35)')};
  display: grid;
  place-items: center;
  z-index: 1000;
  animation: ${fadeIn} 120ms ease-out;
  padding: 0 15px;
`;

export const ModalContainer = styled.div<{ size: 'sm' | 'md' | 'lg' | 'xl' }>`
  width: 100%;
  max-width: ${({ size }) =>
    size === 'sm' ? '420px' : size === 'md' ? '560px' : size === 'lg' ? '720px' : '920px'};
  margin: 24px;
  border-radius: ${({ theme }) => (theme as AppTheme).radius.lg};
  background: ${({ theme }) => (theme as AppTheme).colors.background};
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
  border: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
  box-shadow: ${({ theme }) => (theme as AppTheme).shadow.lg};
  animation: ${scaleIn} 140ms ease-out;
  max-height: calc(100vh - 48px);
  display: grid;
  grid-template-rows: auto 1fr auto;
`;

export const ModalHeader = styled.header`
  display: flex;
  align-items: center;
  gap: 12px;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
`;

export const ModalTitle = styled.h2`
  margin: 0;
  font-weight: 600;
  font-size: ${({ theme }) => (theme as AppTheme).font.sizes.lg};
  color: ${({ theme }) => (theme as AppTheme).colors.foreground};
`;

export const ModalBody = styled.div`
  padding: 16px 20px;
  overflow: auto;
`;

export const ModalFooter = styled.footer`
  padding: 12px 20px;
  display: flex;
  gap: 8px;
  justify-content: flex-end;
  border-top: 1px solid ${({ theme }) => (theme as AppTheme).colors.border};
`;

export const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: ${({ theme }) => (theme as AppTheme).colors.muted};
  cursor: pointer;
  padding: 8px;
  border-radius: ${({ theme }) => (theme as AppTheme).radius.sm};
  transition:
    background 120ms ease,
    color 120ms ease;

  &:hover {
    color: ${({ theme }) => (theme as AppTheme).colors.foreground};
    background: ${({ theme }) =>
      (theme as AppTheme).isDark ? 'rgba(255,255,255,.06)' : 'rgba(0,0,0,.04)'};
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 3px ${({ theme }) => (theme as AppTheme).colors.primary[500]}33;
  }
`;
