'use client';

import { ThemeToggle } from '@/components/ui/theme-toggle';

const colorGroups = [
  {
    title: 'Base',
    colors: [
      { name: 'background', var: '--background' },
      { name: 'foreground', var: '--foreground' },
    ],
  },
  {
    title: 'Primary',
    colors: [
      { name: 'primary', var: '--primary' },
      { name: 'primary-foreground', var: '--primary-foreground' },
    ],
  },
  {
    title: 'Secondary',
    colors: [
      { name: 'secondary', var: '--secondary' },
      { name: 'secondary-foreground', var: '--secondary-foreground' },
    ],
  },
  {
    title: 'Accent',
    colors: [
      { name: 'accent', var: '--accent' },
      { name: 'accent-foreground', var: '--accent-foreground' },
    ],
  },
  {
    title: 'Muted',
    colors: [
      { name: 'muted', var: '--muted' },
      { name: 'muted-foreground', var: '--muted-foreground' },
    ],
  },
  {
    title: 'Card',
    colors: [
      { name: 'card', var: '--card' },
      { name: 'card-foreground', var: '--card-foreground' },
    ],
  },
  {
    title: 'Popover',
    colors: [
      { name: 'popover', var: '--popover' },
      { name: 'popover-foreground', var: '--popover-foreground' },
    ],
  },
  {
    title: 'Border & Ring',
    colors: [
      { name: 'border', var: '--border' },
      { name: 'ring', var: '--ring' },
      { name: 'input', var: '--input' },
    ],
  },
  {
    title: 'Destructive',
    colors: [
      { name: 'destructive', var: '--destructive' },
      { name: 'destructive-foreground', var: '--destructive-foreground' },
    ],
  },
  {
    title: 'Charts',
    colors: [
      { name: 'chart-1', var: '--chart-1' },
      { name: 'chart-2', var: '--chart-2' },
      { name: 'chart-3', var: '--chart-3' },
      { name: 'chart-4', var: '--chart-4' },
      { name: 'chart-5', var: '--chart-5' },
    ],
  },
  {
    title: 'Sidebar',
    colors: [
      { name: 'sidebar', var: '--sidebar' },
      { name: 'sidebar-foreground', var: '--sidebar-foreground' },
      { name: 'sidebar-primary', var: '--sidebar-primary' },
      { name: 'sidebar-primary-foreground', var: '--sidebar-primary-foreground' },
      { name: 'sidebar-accent', var: '--sidebar-accent' },
      { name: 'sidebar-accent-foreground', var: '--sidebar-accent-foreground' },
      { name: 'sidebar-border', var: '--sidebar-border' },
      { name: 'sidebar-ring', var: '--sidebar-ring' },
    ],
  },
];

function ColorSwatch({ name, variable }: { name: string; variable: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div
        className="h-16 w-full rounded-md border"
        style={{ backgroundColor: `var(${variable})` }}
      />
      <div className="flex flex-col">
        <span className="text-sm font-medium">{name}</span>
        <span className="text-xs text-muted-foreground font-mono">{variable}</span>
      </div>
    </div>
  );
}

export default function ColorPalette() {
  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Color Palette</h1>
          <ThemeToggle />
        </div>
        <div className="grid gap-8">
          {colorGroups.map((group) => (
            <div key={group.title}>
              <h2 className="text-xl font-semibold mb-4">{group.title}</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {group.colors.map((color) => (
                  <ColorSwatch key={color.name} name={color.name} variable={color.var} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
