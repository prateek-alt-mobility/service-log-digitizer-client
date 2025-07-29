'use client';
import { useGetInvoiceAnalyticsQuery } from './home.api';

export default function Home() {
  const { data, isLoading } = useGetInvoiceAnalyticsQuery();
  console.log(data);
  if (isLoading) return <div>Loading...</div>;
  return <div className="bg-background text-foreground">Home</div>;
}
