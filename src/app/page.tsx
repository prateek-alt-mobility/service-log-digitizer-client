import { FormExample } from '@/components/common/form-example';
import { ThemeToggle } from '@/components/ui/theme-toggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <ThemeToggle />
      <h1>Hello World</h1>
    </div>
  );
}
