'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, User, Building, ArrowRight, Loader2, Download } from 'lucide-react';
import { PDFPreview } from '@/components/ui/pdf-preview';
import { useGetServicesQuery } from './service.api';
import { ServiceItem } from './service.api';

function ServiceCard({ service }: { service: ServiceItem }) {
  const router = useRouter();

  const getStatusColor = (status: string) => {
    switch (status.toUpperCase()) {
      case 'COMPLETED':
      case 'APPROVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      case 'IN_PROGRESS':
      case 'PROCESSING':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
      case 'DRAFT':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'PENDING_REVIEW':
      case 'PENDING':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'REJECTED':
      case 'FAILED':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toUpperCase()) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'NORMAL':
      case 'LOW':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  const handleCardClick = () => {
    router.push(`/service-listing/${service._id}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getFileSize = (url: string) => {
    // This would typically come from the API, but for now we'll estimate
    return '2.4 MB';
  };

  return (
    <Card
      className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-border hover:border-primary/20"
      onClick={handleCardClick}
    >
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-card-foreground mb-2">
              {service.serviceNo}
            </CardTitle>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{service.createdBy}</span>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex gap-4">
          {/* PDF Preview Section */}
          <div className="flex-shrink-0">
            <PDFPreview
              fileUrl={service.invoice?.fileUrl}
              fileName={service.invoice?.fileName}
              size="small"
              showActions={false}
            />
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">
                {service.description || 'No description available'}
              </p>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3">
                <Calendar className="h-3 w-3" />
                <span>{formatDate(service.createdAt)}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="text-xs">
                  {service.serviceType}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {service.regNo}
                </Badge>
              </div>
            </div>

            <div className="flex items-center justify-end mt-3">
              <Button
                variant="ghost"
                size="sm"
                className="text-primary hover:text-primary/80"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCardClick();
                }}
              >
                View Details
                <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Utility function to convert service data to CSV
const convertToCSV = (services: ServiceItem[]) => {
  const headers = [
    'Service No',
    'Reference No',
    'Registration No',
    'Service Type',
    'Status',
    'Priority',
    'Description',
    'Created By',
    'Created Date',
    'Service Date',
    'Total Cost',
    'Invoice Number',
    'Shop Name',
    'Shop Address',
    'Shop Phone',
    'Vehicle VIN',
    'Vehicle Make',
    'Vehicle Model',
    'Vehicle Year',
    'Vehicle Mileage',
    'Data Verified',
    'Requires Manual Review'
  ];

  const csvData = services.map(service => [
    service.serviceNo,
    service.refNo,
    service.regNo,
    service.serviceType,
    service.status,
    service.priority,
    service.description || '',
    service.createdBy,
    new Date(service.createdAt).toLocaleDateString(),
    service.serviceDate ? new Date(service.serviceDate).toLocaleDateString() : '',
    service.totalCost || service.extractedData?.costs?.totalCost || 0,
    service.extractedData?.invoiceNumber || '',
    service.extractedData?.shopName || '',
    service.extractedData?.shopAddress || '',
    service.extractedData?.shopPhone || '',
    service.extractedData?.vehicleInfo?.vin || '',
    service.extractedData?.vehicleInfo?.make || '',
    service.extractedData?.vehicleInfo?.model || '',
    service.extractedData?.vehicleInfo?.year || '',
    service.extractedData?.vehicleInfo?.mileage || '',
    service.isDataVerified ? 'Yes' : 'No',
    service.requiresManualReview ? 'Yes' : 'No'
  ]);

  const csvContent = [headers, ...csvData]
    .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  return csvContent;
};

// Function to download CSV
const downloadCSV = (csvContent: string, filename: string) => {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export default function ServiceListing() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [isExporting, setIsExporting] = useState(false);

  // Use Redux Toolkit Query hook
  const { data: apiResponse, isLoading, error, refetch } = useGetServicesQuery();

  const services = apiResponse?.data?.data || [];
  const statuses = ['All', ...Array.from(new Set(services.map((service) => service.status)))];

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.serviceNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.refNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.createdBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || service.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    setIsExporting(true);
    try {
      const csvContent = convertToCSV(filteredServices);
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `service-listings-${timestamp}.csv`;
      downloadCSV(csvContent, filename);
    } catch (error) {
      console.error('Error exporting CSV:', error);
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading services...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Error Loading Services</h1>
          <p className="text-muted-foreground mb-4">
            {error &&
            'data' in error &&
            typeof error.data === 'object' &&
            error.data &&
            'message' in error.data
              ? String(error.data.message)
              : 'Failed to fetch services'}
          </p>
          <Button onClick={() => refetch()}>Try Again</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Service Documents</h1>
          <p className="text-muted-foreground">
            Browse and manage your service documents and reports
          </p>
        </div>

        {/* Filters and Export */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search services..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            {statuses.map((status) => (
              <Button
                key={status}
                variant={selectedStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedStatus(status)}
                className="text-xs"
              >
                {status}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              disabled={isExporting || filteredServices.length === 0}
              className="text-xs"
            >
              {isExporting ? (
                <Loader2 className="h-3 w-3 animate-spin mr-1" />
              ) : (
                <Download className="h-3 w-3 mr-1" />
              )}
              Export CSV
            </Button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-sm text-muted-foreground">
            Showing {filteredServices.length} of {services.length} services
          </p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>

        {filteredServices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No services found</h3>
            <p className="text-muted-foreground">Try adjusting your search terms or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
