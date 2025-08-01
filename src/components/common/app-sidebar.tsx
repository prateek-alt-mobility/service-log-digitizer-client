'use client';

import * as React from 'react';
import { BarChart3, Plus, FileText, Upload } from 'lucide-react';

import { NavMain } from './nav-main';
import { NavUser } from './nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  useSidebar,
} from '@/components/ui/sidebar';

// Navigation data for the sidebar
const data = [
  {
    title: 'Analytics Dashboard',
    url: '/dashboard',
    icon: BarChart3,
  },
  {
    title: 'Service Documents',
    url: '/service-listing',
    icon: FileText,
  },
  {
    title: 'Add Invoice',
    url: '/add-invoice',
    icon: Plus,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state } = useSidebar();
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        {state === 'collapsed' ? (
          <div className="text-xl text-center font-bold">TS</div>
        ) : (
          <div className="text-xl p-2 font-bold">🧑🏻‍💻 Team Supra</div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
