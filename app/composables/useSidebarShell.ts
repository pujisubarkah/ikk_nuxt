export function useSidebarShell() {
  const isMobileSidebarOpen = useState<boolean>('is-mobile-sidebar-open', () => false);
  const isDesktopSidebarCollapsed = useState<boolean>('is-desktop-sidebar-collapsed', () => false);

  return {
    isMobileSidebarOpen,
    isDesktopSidebarCollapsed,
  };
}
