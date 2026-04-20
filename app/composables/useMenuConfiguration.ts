import {
  IconHome,
  IconLayoutDashboard,
  IconFileText,
  IconChartBar,
  IconNetwork,
  IconUsers,
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
  groupLabel: string;
  items: SidebarMenuItem[];
}

export function useMenuConfiguration() {
  const route = useRoute()
  const slug = computed(() => route.params.slug as string)

  // Role 1 - Admin Nasional
  const menuGroupsRole1 = computed<SidebarMenuGroup[]>(() => [
    {
      key: 'home',
      groupLabel: '',
      items: [
        {
          key: 'home',
          label: 'Home',
          icon: IconHome,
          to: '/dashboard',
        },
      ],
    },
    {
      key: 'main',
      groupLabel: 'Menu Utama',
      items: [
        {
          key: 'dashboard',
          label: 'Dashboard',
          icon: IconLayoutDashboard,
          to: `/${slug.value}/dashboard`,
        },
        {
          key: 'kebijakan',
          label: 'Kebijakan',
          icon: IconFileText,
          to: `/${slug.value}/kebijakan`,
        },
        {
          key: 'ringkasan',
          label: 'Ringkasan',
          icon: IconFileText,
          to: `/${slug.value}/ringkasan`,
        },
        {
          key: 'chart',
          label: 'Chart',
          icon: IconChartBar,
          to: `/${slug.value}/chart`,
        },
        {
          key: 'peta-kinerja',
          label: 'Peta Kinerja',
          icon: IconNetwork,
          to: `/${slug.value}/peta-kinerja`,
        },
      ],
    },
    {
      key: 'master-data',
      groupLabel: 'Master Data',
      items: [
        {
          key: 'instansi',
          label: 'Instansi',
          icon: IconUsers,
          to: `/${slug.value}/instansi`,
        },
        {
          key: 'pengguna',
          label: 'Pengguna',
          icon: IconUser,
          to: `/${slug.value}/pengguna`,
        },
      ],
    },
  ]);

  return {
    menuGroupsRole1,
  };
}