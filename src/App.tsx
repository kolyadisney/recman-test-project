import { Board, Header } from '@/components';
import { RootModal } from '@/components/common/modal/root-modal.tsx';
import { ThemeProvider } from '@/theme';
import { useThemeSwitcher } from '@/theme/useThemeSwitcher';

function App() {
  const { theme, isDark, toggle } = useThemeSwitcher();

  return (
    <ThemeProvider theme={theme}>
      <title>Kanban Test Board</title>
      <div style={{ background: theme.colors.background, minHeight: '100vh' }}>
        <Header isDark={isDark} onToggleTheme={toggle} />
        <Board />
        <RootModal />
      </div>
    </ThemeProvider>
  );
}

export default App;
