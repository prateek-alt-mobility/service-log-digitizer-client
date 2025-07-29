'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

import { cn } from '@/lib/utils';

const Breadcrumb = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  const breadcrumbs = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const label = segment
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    return {
      href,
      label,
    };
  });

  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
      <Link href="/" className="flex items-center hover:text-foreground transition-colors">
        <Home className="h-4 w-4" />
      </Link>
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={breadcrumb.href} className="flex items-center">
          <ChevronRight className="h-4 w-4 mx-1" />
          <Link
            href={breadcrumb.href}
            className={cn(
              'hover:text-foreground transition-colors',
              index === breadcrumbs.length - 1 && 'text-foreground font-medium',
            )}
          >
            {breadcrumb.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default Breadcrumb;
