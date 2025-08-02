'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PDFPreview } from '@/components/ui/pdf-preview';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  FileText,
  Calendar,
  User,
  Building,
  ArrowLeft,
  Download,
  Share2,
  Eye,
  Clock,
  Tag,
  File,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon,
  Loader2,
  ExternalLink,
  Wrench,
  Package,
  DollarSign,
  Car,
  Settings,
  ChevronDown,
  Copy,
  FileDown,
} from 'lucide-react';
import { useGetServicesQuery, useExportServiceMutation } from '../service.api';
import { ServiceItem } from '../service.api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { SERVICE_CONFIG } from '../config';
import { useState } from 'react';

function getStatusIcon(status: string) {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'APPROVED':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'IN_PROGRESS':
    case 'PROCESSING':
      return <ClockIcon className="h-4 w-4 text-blue-600" />;
    case 'DRAFT':
      return <File className="h-4 w-4 text-yellow-600" />;
    case 'PENDING_REVIEW':
    case 'PENDING':
      return <AlertCircle className="h-4 w-4 text-orange-600" />;
    case 'REJECTED':
    case 'FAILED':
      return <AlertCircle className="h-4 w-4 text-red-600" />;
    default:
      return <ClockIcon className="h-4 w-4 text-gray-600" />;
  }
}

function getStatusColor(status: string) {
  switch (status.toUpperCase()) {
    case 'COMPLETED':
    case 'APPROVED':
      return SERVICE_CONFIG.statuses.COMPLETED.bgColor;
    case 'IN_PROGRESS':
    case 'PROCESSING':
      return SERVICE_CONFIG.statuses.IN_PROGRESS.bgColor;
    case 'DRAFT':
      return SERVICE_CONFIG.statuses.DRAFT.bgColor;
    case 'PENDING_REVIEW':
    case 'PENDING':
      return SERVICE_CONFIG.statuses.PENDING_REVIEW.bgColor;
    case 'REJECTED':
    case 'FAILED':
      return SERVICE_CONFIG.statuses.REJECTED.bgColor;
    default:
      return SERVICE_CONFIG.statuses.DEFAULT.bgColor;
  }
}

function getPriorityColor(priority: string) {
  switch (priority.toUpperCase()) {
    case 'HIGH':
      return SERVICE_CONFIG.priorities.HIGH.bgColor;
    case 'MEDIUM':
      return SERVICE_CONFIG.priorities.MEDIUM.bgColor;
    case 'NORMAL':
    case 'LOW':
      return SERVICE_CONFIG.priorities.NORMAL.bgColor;
    default:
      return SERVICE_CONFIG.priorities.DEFAULT.bgColor;
  }
}

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  const [isExporting, setIsExporting] = useState(false);

  // Use Redux Toolkit Query hook
  const { data: apiResponse, isLoading, error } = useGetServicesQuery();
  const [exportService] = useExportServiceMutation();

  const services = apiResponse?.data?.data || [];
  const service = services.find((s) => s._id === serviceId);

  // Helper function to get the active data (prioritizes userEditedData when status is complete)
  const getActiveServiceData = () => {
    if (!service) return null;

    // If status is 'COMPLETED' or 'APPROVED' and userEditedData exists, use userEditedData
    const status = service.status?.toUpperCase();
    if (service.userEditedData) {
      console.log(`Using userEditedData for service ${service._id} with status ${service.status}`);
      return service.userEditedData;
    }

    // Otherwise, fall back to extractedData
    console.log(
      `Using extractedData for service ${service._id} with status ${service.status}, userEditedData available: ${!!service.userEditedData}`,
    );
    return service.extractedData;
  };

  // Store the active data to avoid multiple function calls
  const activeServiceData = getActiveServiceData();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      SERVICE_CONFIG.dateFormat.locale,
      SERVICE_CONFIG.dateFormat.options,
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(SERVICE_CONFIG.currency.locale, SERVICE_CONFIG.currency).format(
      amount,
    );
  };

  const getFileSize = (url: string) => {
    // This would typically come from the API, but for now we'll estimate
    return SERVICE_CONFIG.ui.defaultFileSize;
  };

  // Prepare chart data for parts cost breakdown
  const getPartsChartData = () => {
    if (!activeServiceData?.parts) return [];
    return activeServiceData.parts
      .filter((part: any) => part && part.name && part.totalCost)
      .map((part: any, index: number) => ({
        name: part.name || 'Unknown Part',
        value: part.totalCost || 0,
        color: `hsl(${index * 60}, 70%, 50%)`,
      }));
  };

  // Prepare chart data for services cost breakdown
  const getServicesChartData = () => {
    if (!activeServiceData?.services) return [];
    return activeServiceData.services
      .filter((service: any) => service && service.type && service.cost)
      .map((service: any, index: number) => ({
        name: service.type || 'Unknown Service',
        value: service.cost || 0,
        color: `hsl(${index * 90 + 180}, 70%, 50%)`,
      }));
  };

  // Prepare chart data for cost breakdown
  const getCostBreakdownData = () => {
    if (!activeServiceData?.costs) return [];
    return [
      {
        name: 'Parts',
        value: activeServiceData.costs.partsCost || 0,
        color: SERVICE_CONFIG.chartColors.costBreakdown.parts,
      },
      {
        name: 'Labor',
        value: activeServiceData.costs.laborCost || 0,
        color: SERVICE_CONFIG.chartColors.costBreakdown.labor,
      },
      {
        name: 'Tax',
        value: activeServiceData.costs.taxAmount || 0,
        color: SERVICE_CONFIG.chartColors.costBreakdown.tax,
      },
    ];
  };

  const handleExport = async (format: 'pdf' | 'excel') => {
    if (!service) return;

    setIsExporting(true);
    try {
      const response = await exportService({ id: service._id, format }).unwrap();

      if (response.data.url) {
        // Open the file in a new tab
        window.open(response.data.url, '_blank');
      }
    } catch (error) {
      console.error('Export failed:', error);
      // Could add toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  const handleCopyLink = async () => {
    if (!service) return;

    setIsExporting(true);
    try {
      const response = await exportService({ id: service._id, format: 'pdf' }).unwrap();

      if (response.data.url) {
        await navigator.clipboard.writeText(response.data.url);
        // Could add toast notification here
      }
    } catch (error) {
      console.error('Copy link failed:', error);
      // Could add toast notification here
    } finally {
      setIsExporting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{SERVICE_CONFIG.labels.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-foreground mb-2">
            {SERVICE_CONFIG.labels.notFound}
          </h1>
          <p className="text-muted-foreground mb-4 text-sm sm:text-base">
            {error &&
            'data' in error &&
            typeof error.data === 'object' &&
            error.data &&
            'message' in error.data
              ? String(error.data.message)
              : SERVICE_CONFIG.labels.notFoundMessage}
          </p>
          <Button onClick={() => router.push(SERVICE_CONFIG.navigation.backRoute)}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Header */}
        <div className="mb-4 sm:mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push(SERVICE_CONFIG.navigation.backRoute)}
            className="mb-3 sm:mb-4 p-2 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Back to Services</span>
            <span className="sm:hidden">Back</span>
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-2 break-words">
                {service.invoice?.fileName || service.serviceNo || 'Service Details'}
              </h1>
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground mb-4">
                {service.refNo && (
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{service.refNo}</span>
                  </div>
                )}
                {service.createdBy && (
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{service.createdBy}</span>
                  </div>
                )}
                {service.createdAt && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 flex-shrink-0" />
                    <span className="truncate">{formatDate(service.createdAt)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Export Dropdown Button */}
            <div className="flex-shrink-0">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    disabled={isExporting}
                    className="w-full sm:w-auto"
                    size="sm"
                  >
                    {isExporting ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Download className="h-4 w-4 mr-2" />
                    )}
                    Export
                    <ChevronDown className="h-4 w-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => handleExport('pdf')}>
                    <FileDown className="h-4 w-4 mr-2" />
                    Download PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleCopyLink}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy PDF Link
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 sm:gap-6">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-4 sm:space-y-6">
            {/* PDF Preview */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                  <FileText className="h-5 w-5" />
                  Document Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Document Info */}
                  <div className="flex flex-col items-center justify-center mb-4">
                    <h3 className="text-base sm:text-lg font-semibold text-primary mb-2 text-center break-words">
                      {service.invoice?.fileName || service.serviceNo || 'Document'}
                    </h3>
                    <div className="space-y-1 text-xs sm:text-sm text-muted-foreground text-center">
                      <div>Status: {service.invoice?.processingStatus || 'Unknown'}</div>
                      <div>Size: {getFileSize(service.invoice?.fileUrl || '')}</div>
                      <div>
                        Uploaded:{' '}
                        {service.invoice?.uploadedAt
                          ? formatDate(service.invoice.uploadedAt)
                          : service.createdAt
                            ? formatDate(service.createdAt)
                            : 'Unknown'}
                      </div>
                    </div>
                  </div>

                  {/* PDF Preview */}
                  {service.invoice?.fileUrl ? (
                    <PDFPreview
                      fileUrl={service.invoice.fileUrl}
                      fileName={service.invoice?.fileName || service.serviceNo || 'Document'}
                      size="medium"
                      showActions={true}
                    />
                  ) : (
                    <div className="flex items-center justify-center h-48 sm:h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-center p-4">
                        <FileText className="h-8 sm:h-12 w-8 sm:w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground text-sm sm:text-base">
                          No document available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            {activeServiceData?.vehicleInfo && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {activeServiceData.vehicleInfo.vin && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          VIN
                        </label>
                        <p className="text-sm sm:text-base font-medium break-all">
                          {activeServiceData.vehicleInfo.vin}
                        </p>
                      </div>
                    )}
                    {activeServiceData.vehicleInfo.registrationNumber && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Registration
                        </label>
                        <p className="text-sm sm:text-base font-medium">
                          {activeServiceData.vehicleInfo.registrationNumber}
                        </p>
                      </div>
                    )}
                    {activeServiceData.vehicleInfo.make && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Make
                        </label>
                        <p className="text-sm sm:text-base font-medium">
                          {activeServiceData.vehicleInfo.make}
                        </p>
                      </div>
                    )}
                    {activeServiceData.vehicleInfo.model && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Model
                        </label>
                        <p className="text-sm sm:text-base font-medium">
                          {activeServiceData.vehicleInfo.model}
                        </p>
                      </div>
                    )}
                    {activeServiceData.vehicleInfo.mileage && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Mileage
                        </label>
                        <p className="text-sm sm:text-base font-medium">
                          {activeServiceData.vehicleInfo.mileage.toLocaleString()} km
                        </p>
                      </div>
                    )}
                    {activeServiceData.vehicleInfo.year && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Year
                        </label>
                        <p className="text-sm sm:text-base font-medium">
                          {activeServiceData.vehicleInfo.year}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {activeServiceData?.services && activeServiceData.services.length > 0 && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Wrench className="h-5 w-5" />
                    Services ({activeServiceData.services.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Service Type</TableHead>
                          <TableHead className="text-xs sm:text-sm">Description</TableHead>
                          <TableHead className="text-right text-xs sm:text-sm">Cost</TableHead>
                          {activeServiceData.services.some((s: any) => s.laborHours) && (
                            <TableHead className="text-right text-xs sm:text-sm">
                              Labor Hours
                            </TableHead>
                          )}
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeServiceData.services.map((serviceItem: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-xs sm:text-sm">
                              {serviceItem.type || 'Unknown'}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm max-w-[200px] break-words">
                              {serviceItem.description || 'No description'}
                            </TableCell>
                            <TableCell className="text-right font-medium text-xs sm:text-sm">
                              {serviceItem.cost ? formatCurrency(serviceItem.cost) : 'N/A'}
                            </TableCell>
                            {activeServiceData.services.some((s: any) => s.laborHours) && (
                              <TableCell className="text-right text-xs sm:text-sm">
                                {serviceItem.laborHours || '-'}
                              </TableCell>
                            )}
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parts */}
            {activeServiceData?.parts && activeServiceData.parts.length > 0 && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Package className="h-5 w-5" />
                    Parts ({activeServiceData.parts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="text-xs sm:text-sm">Part Name</TableHead>
                          <TableHead className="text-xs sm:text-sm">Part Number</TableHead>
                          <TableHead className="text-right text-xs sm:text-sm">Qty</TableHead>
                          <TableHead className="text-right text-xs sm:text-sm">Unit Cost</TableHead>
                          <TableHead className="text-right text-xs sm:text-sm">
                            Total Cost
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {activeServiceData.parts.map((part: any, index: number) => (
                          <TableRow key={index}>
                            <TableCell className="font-medium text-xs sm:text-sm max-w-[150px] break-words">
                              {part.name || 'Unknown Part'}
                            </TableCell>
                            <TableCell className="text-xs sm:text-sm">
                              {part.partNumber || 'N/A'}
                            </TableCell>
                            <TableCell className="text-right text-xs sm:text-sm">
                              {part.quantity || 0}
                            </TableCell>
                            <TableCell className="text-right text-xs sm:text-sm">
                              {part.unitCost ? formatCurrency(part.unitCost) : 'N/A'}
                            </TableCell>
                            <TableCell className="text-right font-medium text-xs sm:text-sm">
                              {part.totalCost ? formatCurrency(part.totalCost) : 'N/A'}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {service.description || 'No description available'}
                </p>
              </CardContent>
            </Card>

            {/* Extracted Data */}
            {activeServiceData && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="text-lg sm:text-xl">Extracted Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    {activeServiceData.invoiceNumber && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Invoice Number
                        </label>
                        <p className="text-sm sm:text-base break-all">
                          {activeServiceData.invoiceNumber}
                        </p>
                      </div>
                    )}
                    {activeServiceData.shopName && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Shop Name
                        </label>
                        <p className="text-sm sm:text-base">{activeServiceData.shopName}</p>
                      </div>
                    )}
                    {activeServiceData.shopAddress && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Shop Address
                        </label>
                        <p className="text-sm sm:text-base break-words">
                          {activeServiceData.shopAddress}
                        </p>
                      </div>
                    )}
                    {activeServiceData.shopPhone && (
                      <div>
                        <label className="text-xs sm:text-sm font-medium text-muted-foreground">
                          Shop Phone
                        </label>
                        <p className="text-sm sm:text-base">{activeServiceData.shopPhone}</p>
                      </div>
                    )}
                    {!activeServiceData.invoiceNumber &&
                      !activeServiceData.shopName &&
                      !activeServiceData.shopAddress &&
                      !activeServiceData.shopPhone && (
                        <div className="col-span-1 sm:col-span-2">
                          <p className="text-xs sm:text-sm text-muted-foreground">
                            No extracted information available
                          </p>
                        </div>
                      )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4 sm:space-y-6">
            {/* Service Information */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Service No</span>
                  <span className="text-xs sm:text-sm font-medium text-right break-all">
                    {service.serviceNo || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Reference No</span>
                  <span className="text-xs sm:text-sm font-medium text-right break-all">
                    {service.refNo || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Registration No</span>
                  <span className="text-xs sm:text-sm font-medium text-right">
                    {service.regNo || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Service Type</span>
                  <Badge variant="outline" className="text-xs">
                    {service.serviceType || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Status</span>
                  <Badge className={`${getStatusColor(service.status)} text-xs`}>
                    {getStatusIcon(service.status)}
                    <span className="ml-1">{service.status || 'Unknown'}</span>
                  </Badge>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Priority</span>
                  <Badge className={`${getPriorityColor(service.priority)} text-xs`}>
                    {service.priority || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Total Cost</span>
                  <span className="text-xs sm:text-sm font-medium text-right">
                    {service.totalCost ? formatCurrency(service.totalCost) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Created</span>
                  <span className="text-xs sm:text-sm font-medium text-right">
                    {service.createdAt ? formatDate(service.createdAt) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Updated</span>
                  <span className="text-xs sm:text-sm font-medium text-right">
                    {service.updatedAt ? formatDate(service.updatedAt) : 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between items-start gap-2">
                  <span className="text-xs sm:text-sm text-muted-foreground">Updated By</span>
                  <span className="text-xs sm:text-sm font-medium text-right break-all">
                    {service.updatedBy || 'N/A'}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* Processing Status */}
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">Processing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">AI Confidence</span>
                    <span className="text-xs sm:text-sm font-medium">
                      {service.invoice?.aiConfidence
                        ? `${Math.round(service.invoice.aiConfidence * 100)}%`
                        : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">Data Verified</span>
                    <Badge
                      variant={service.isDataVerified ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {service.isDataVerified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs sm:text-sm text-muted-foreground">Manual Review</span>
                    <Badge
                      variant={service.requiresManualReview ? 'destructive' : 'secondary'}
                      className="text-xs"
                    >
                      {service.requiresManualReview ? 'Required' : 'Not Required'}
                    </Badge>
                  </div>
                  {service.invoice?.processingMetrics?.totalTime && (
                    <div className="flex justify-between items-center gap-2">
                      <span className="text-xs sm:text-sm text-muted-foreground">
                        Processing Time
                      </span>
                      <span className="text-xs sm:text-sm font-medium">
                        {service.invoice.processingMetrics.totalTime.toFixed(2)}s
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Cost Breakdown Charts */}
            {activeServiceData?.costs && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <DollarSign className="h-5 w-5" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 sm:space-y-6">
                    {/* Overall Cost Breakdown */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Cost Distribution</h4>
                      <div className="h-32 sm:h-48">
                        <ChartContainer
                          config={{
                            parts: { color: SERVICE_CONFIG.chartColors.costBreakdown.parts },
                            labor: { color: SERVICE_CONFIG.chartColors.costBreakdown.labor },
                            tax: { color: SERVICE_CONFIG.chartColors.costBreakdown.tax },
                          }}
                        >
                          <PieChart>
                            <Pie
                              data={getCostBreakdownData()}
                              cx="50%"
                              cy="50%"
                              innerRadius={20}
                              outerRadius={60}
                              paddingAngle={5}
                              dataKey="value"
                            >
                              {getCostBreakdownData().map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                              ))}
                            </Pie>
                            <ChartTooltip content={<ChartTooltipContent />} />
                          </PieChart>
                        </ChartContainer>
                      </div>
                      <div className="mt-3 space-y-2">
                        {getCostBreakdownData().map((item, index) => (
                          <div key={index} className="flex justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-2 h-2 sm:w-3 sm:h-3 rounded-full flex-shrink-0"
                                style={{ backgroundColor: item.color }}
                              />
                              <span className="truncate">{item.name}</span>
                            </div>
                            <span className="font-medium">{formatCurrency(item.value)}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Total Cost Summary */}
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-muted-foreground">Subtotal</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {activeServiceData.costs.subtotal
                            ? formatCurrency(activeServiceData.costs.subtotal)
                            : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-muted-foreground">Tax</span>
                        <span className="text-xs sm:text-sm font-medium">
                          {activeServiceData.costs.taxAmount
                            ? formatCurrency(activeServiceData.costs.taxAmount)
                            : 'N/A'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-base sm:text-lg font-bold">
                        <span>Total</span>
                        <span>
                          {activeServiceData.costs.totalCost
                            ? formatCurrency(activeServiceData.costs.totalCost)
                            : 'N/A'}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parts Cost Chart */}
            {activeServiceData?.parts && activeServiceData.parts.length > 0 && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Package className="h-5 w-5" />
                    Parts Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-64">
                    <ChartContainer
                      config={{
                        value: { color: SERVICE_CONFIG.chartColors.partsChart },
                      }}
                    >
                      <BarChart data={getPartsChartData()}>
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          fontSize={10}
                        />
                        <YAxis fontSize={10} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill={SERVICE_CONFIG.chartColors.partsChart} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services Cost Chart */}
            {activeServiceData?.services && activeServiceData.services.length > 0 && (
              <Card>
                <CardHeader className="pb-3 sm:pb-4">
                  <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                    <Wrench className="h-5 w-5" />
                    Services Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-48 sm:h-64">
                    <ChartContainer
                      config={{
                        value: { color: SERVICE_CONFIG.chartColors.servicesChart },
                      }}
                    >
                      <BarChart data={getServicesChartData()}>
                        <XAxis
                          dataKey="name"
                          angle={-45}
                          textAnchor="end"
                          height={60}
                          fontSize={10}
                        />
                        <YAxis fontSize={10} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill={SERVICE_CONFIG.chartColors.servicesChart} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
