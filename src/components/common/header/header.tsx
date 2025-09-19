import { MoonIcon, SunIcon } from '@heroicons/react/24/solid';
import React from 'react';

import { Button, Input } from '@/components';
import { Select, type SelectOption } from '@/components/ui/select';
import { useBoardStore } from '@/store/useBoardStore.ts';

import { HeaderStyled, HeaderLogo, HeaderActions } from './header.styled';

export interface HeaderProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const filterOptions: Array<SelectOption<'all' | 'active' | 'completed'>> = [
  { value: 'all', label: 'All tasks' },
  { value: 'active', label: 'Active' },
  { value: 'completed', label: 'Completed' },
];

export const TaskFilterSelect: React.FC<{ fullWidth?: boolean }> = ({ fullWidth }) => {
  const currentFilter = useBoardStore((state) => state.filter);
  const setFilter = useBoardStore((state) => state.setFilter);

  return (
    <Select
      options={filterOptions}
      value={currentFilter}
      onChange={setFilter}
      placeholder="Filter tasks…"
      ariaLabel="Task filter"
      fullWidth={fullWidth}
      size="md"
      radius="md"
    />
  );
};

export const Header: React.FC<HeaderProps> = ({ isDark, onToggleTheme }) => {
  const setSearchQuery = useBoardStore((state) => state.setSearchQuery);
  const searchQuery = useBoardStore((state) => state.searchQuery);
  const setFilter = useBoardStore((state) => state.setFilter);
  const onClearFilters = React.useCallback(() => {
    setSearchQuery('');
    setFilter('all');
  }, [setFilter, setSearchQuery]);
  return (
    <HeaderStyled>
      <HeaderLogo>Board</HeaderLogo>
      <HeaderActions>
        <Input
          variant="bordered"
          placeholder="Search tasks…"
          value={searchQuery}
          fullWidth
          css={{
            position: 'relative',
            top: '-2px',
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <TaskFilterSelect fullWidth />
        <Button
          variant="flat"
          color="default"
          css={{
            flex: '1 0 auto',
          }}
          onClick={onClearFilters}
        >
          Clear filters
        </Button>
        <Button
          isIconOnly
          onClick={onToggleTheme}
          fullWidth
          css={{
            flex: '1 0 auto',
          }}
        >
          {isDark ? <SunIcon width={20} height={20} /> : <MoonIcon width={20} height={20} />}
        </Button>
      </HeaderActions>
    </HeaderStyled>
  );
};
