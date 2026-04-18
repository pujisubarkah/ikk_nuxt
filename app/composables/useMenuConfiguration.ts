import {
  IconBuilding,
  IconCategory2,
  IconDatabase,
  IconReceipt,
  IconUser,
} from '@tabler/icons-vue';

export interface SidebarMenuItem {
  key: string;
  label: string;
  icon: object;
  to: string;
}

export interface SidebarMenuGroup {
  key: string;
  items: SidebarMenuItem[];
}

export function useMenuConfiguration() {
  const menuGroups: SidebarMenuGroup[] = [
    {
      key: 'main',
      items: [
        {
          key: 'overview',
          label: 'Dashboard',
          icon: IconCategory2,
          to: '/dashboard',
        },
        {
          key: 'usage',
          label: 'Penggunaan',
          icon: IconDatabase,
          to: '/dashboard/penggunaan',
        },
        {
          key: 'receipt',
          label: 'Receipt',
          icon: IconReceipt,
          to: '/dashboard/receipt',
        },
      ],
    },
    {
      key: 'management',
      items: [
        {
          key: 'user',
          label: 'User Management',
          icon: IconUser,
          to: '/dashboard/users',
        },
        {
          key: 'company',
          label: 'Company',
          icon: IconBuilding,
          to: '/dashboard/company',
        },
      ],
    },
  ];

  return {
    menuGroups,
  };
}