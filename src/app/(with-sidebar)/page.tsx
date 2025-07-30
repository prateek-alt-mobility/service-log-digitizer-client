'use client';
import { useGetInvoiceAnalyticsQuery } from './home.api';
import ServiceListing from './service-listing/page';

export default function Home() {
  const { data, isLoading } = useGetInvoiceAnalyticsQuery();
  console.log(data);
  
  // Render the ServiceListing component instead of basic home content
  return <ServiceListing />;
}
