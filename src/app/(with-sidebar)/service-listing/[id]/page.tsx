'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PDFPreview } from '@/components/ui/pdf-preview';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
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
} from 'lucide-react';
import { useGetServicesQuery } from '../service.api';
import { ServiceItem } from '../service.api';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import { SERVICE_CONFIG } from '../config';

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

  // Use Redux Toolkit Query hook
  const { data: apiResponse, isLoading, error } = useGetServicesQuery();

  const services = apiResponse?.data?.data || [];
  const service = services.find((s) => s._id === serviceId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(
      SERVICE_CONFIG.dateFormat.locale,
      SERVICE_CONFIG.dateFormat.options
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat(
      SERVICE_CONFIG.currency.locale,
      SERVICE_CONFIG.currency
    ).format(amount);
  };

  const getFileSize = (url: string) => {
    // This would typically come from the API, but for now we'll estimate
    return SERVICE_CONFIG.ui.defaultFileSize;
  };

  // Prepare chart data for parts cost breakdown
  const getPartsChartData = () => {
    if (!service?.extractedData?.parts) return [];
    return service.extractedData.parts
      .filter(part => part && part.name && part.totalCost)
      .map((part, index) => ({
        name: part.name || 'Unknown Part',
        value: part.totalCost || 0,
        color: `hsl(${index * 60}, 70%, 50%)`,
      }));
  };

  // Prepare chart data for services cost breakdown
  const getServicesChartData = () => {
    if (!service?.extractedData?.services) return [];
    return service.extractedData.services
      .filter(service => service && service.type && service.cost)
      .map((service, index) => ({
        name: service.type || 'Unknown Service',
        value: service.cost || 0,
        color: `hsl(${index * 90 + 180}, 70%, 50%)`,
      }));
  };

  // Prepare chart data for cost breakdown
  const getCostBreakdownData = () => {
    if (!service?.extractedData?.costs) return [];
    return [
      { 
        name: 'Parts', 
        value: service.extractedData.costs.partsCost || 0, 
        color: SERVICE_CONFIG.chartColors.costBreakdown.parts 
      },
      { 
        name: 'Labor', 
        value: service.extractedData.costs.laborCost || 0, 
        color: SERVICE_CONFIG.chartColors.costBreakdown.labor 
      },
      { 
        name: 'Tax', 
        value: service.extractedData.costs.taxAmount || 0, 
        color: SERVICE_CONFIG.chartColors.costBreakdown.tax 
      },
    ];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{SERVICE_CONFIG.labels.loading}</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">{SERVICE_CONFIG.labels.notFound}</h1>
          <p className="text-muted-foreground mb-4">
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
      <div className={`${SERVICE_CONFIG.ui.maxWidth} mx-auto ${SERVICE_CONFIG.ui.padding}`}>
        {/* Header */}
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.push(SERVICE_CONFIG.navigation.backRoute)} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {service.invoice?.fileName || service.serviceNo || 'Service Details'}
              </h1>
                              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                  {service.refNo && (
                    <div className="flex items-center gap-2">
                      <Building className="h-4 w-4" />
                      <span>{service.refNo}</span>
                    </div>
                  )}
                  {service.createdBy && (
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      <span>{service.createdBy}</span>
                    </div>
                  )}
                  {service.createdAt && (
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(service.createdAt)}</span>
                    </div>
                  )}
                </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* PDF Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Document Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Document Info */}
                  <div className="flex flex-col items-center justify-center mb-4">
                    <h3 className="text-lg font-semibold text-primary mb-2">
                      {service.invoice?.fileName || service.serviceNo || 'Document'}
                    </h3>
                    <div className="space-y-1 text-sm text-muted-foreground text-center">
                      <div>Status: {service.invoice?.processingStatus || 'Unknown'}</div>
                      <div>Size: {getFileSize(service.invoice?.fileUrl || '')}</div>
                      <div>
                        Uploaded: {service.invoice?.uploadedAt ? formatDate(service.invoice.uploadedAt) : (service.createdAt ? formatDate(service.createdAt) : 'Unknown')}
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
                    <div className="flex items-center justify-center h-64 border-2 border-dashed border-muted-foreground/25 rounded-lg">
                      <div className="text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">No document available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Vehicle Information */}
            {service.extractedData?.vehicleInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Car className="h-5 w-5" />
                    Vehicle Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.extractedData.vehicleInfo.vin && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">VIN</label>
                        <p className="text-sm font-medium">{service.extractedData.vehicleInfo.vin}</p>
                      </div>
                    )}
                    {service.extractedData.vehicleInfo.registrationNumber && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Registration</label>
                        <p className="text-sm font-medium">{service.extractedData.vehicleInfo.registrationNumber}</p>
                      </div>
                    )}
                    {service.extractedData.vehicleInfo.make && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Make</label>
                        <p className="text-sm font-medium">{service.extractedData.vehicleInfo.make}</p>
                      </div>
                    )}
                    {service.extractedData.vehicleInfo.model && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Model</label>
                        <p className="text-sm font-medium">{service.extractedData.vehicleInfo.model}</p>
                      </div>
                    )}
                    {service.extractedData.vehicleInfo.mileage && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Mileage</label>
                        <p className="text-sm font-medium">{service.extractedData.vehicleInfo.mileage.toLocaleString()} km</p>
                      </div>
                    )}
                    {service.extractedData.vehicleInfo.year && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Year</label>
                        <p className="text-sm font-medium">{service.extractedData.vehicleInfo.year}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services */}
            {service.extractedData?.services && service.extractedData.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Services ({service.extractedData.services.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Service Type</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Cost</TableHead>
                        {service.extractedData.services.some(s => s.laborHours) && (
                          <TableHead className="text-right">Labor Hours</TableHead>
                        )}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {service.extractedData.services.map((serviceItem, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{serviceItem.type || 'Unknown'}</TableCell>
                          <TableCell>{serviceItem.description || 'No description'}</TableCell>
                          <TableCell className="text-right font-medium">
                            {serviceItem.cost ? formatCurrency(serviceItem.cost) : 'N/A'}
                          </TableCell>
                          {service.extractedData.services.some(s => s.laborHours) && (
                            <TableCell className="text-right">
                              {serviceItem.laborHours || '-'}
                            </TableCell>
                          )}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Parts */}
            {service.extractedData?.parts && service.extractedData.parts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Parts ({service.extractedData.parts.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Part Name</TableHead>
                        <TableHead>Part Number</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Unit Cost</TableHead>
                        <TableHead className="text-right">Total Cost</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {service.extractedData.parts.map((part, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">{part.name || 'Unknown Part'}</TableCell>
                          <TableCell>{part.partNumber || 'N/A'}</TableCell>
                          <TableCell className="text-right">{part.quantity || 0}</TableCell>
                          <TableCell className="text-right">{part.unitCost ? formatCurrency(part.unitCost) : 'N/A'}</TableCell>
                          <TableCell className="text-right font-medium">
                            {part.totalCost ? formatCurrency(part.totalCost) : 'N/A'}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}

            {/* Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed">
                  {service.description || 'No description available'}
                </p>
              </CardContent>
            </Card>

            {/* Extracted Data */}
            {service.extractedData && (
              <Card>
                <CardHeader>
                  <CardTitle>Extracted Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {service.extractedData.invoiceNumber && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Invoice Number
                        </label>
                        <p className="text-sm">{service.extractedData.invoiceNumber}</p>
                      </div>
                    )}
                    {service.extractedData.shopName && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Shop Name
                        </label>
                        <p className="text-sm">{service.extractedData.shopName}</p>
                      </div>
                    )}
                    {service.extractedData.shopAddress && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Shop Address
                        </label>
                        <p className="text-sm">{service.extractedData.shopAddress}</p>
                      </div>
                    )}
                    {service.extractedData.shopPhone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">
                          Shop Phone
                        </label>
                        <p className="text-sm">{service.extractedData.shopPhone}</p>
                      </div>
                    )}
                    {!service.extractedData.invoiceNumber && !service.extractedData.shopName && 
                     !service.extractedData.shopAddress && !service.extractedData.shopPhone && (
                      <div className="col-span-2">
                        <p className="text-sm text-muted-foreground">No extracted information available</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Processing Information */}
            {service.invoice?.processingError && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-destructive">Processing Error</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-destructive">{service.invoice.processingError}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Cost Breakdown Charts */}
            {service.extractedData?.costs && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5" />
                    Cost Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Overall Cost Breakdown */}
                    <div>
                      <h4 className="text-sm font-medium mb-3">Cost Distribution</h4>
                      <div className="h-48">
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
                              innerRadius={40}
                              outerRadius={80}
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
                          <div key={index} className="flex justify-between text-sm">
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: item.color }}
                              />
                              <span>{item.name}</span>
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
                        <span className="text-sm text-muted-foreground">Subtotal</span>
                        <span className="text-sm font-medium">
                          {service.extractedData.costs.subtotal ? formatCurrency(service.extractedData.costs.subtotal) : 'N/A'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Tax</span>
                        <span className="text-sm font-medium">
                          {service.extractedData.costs.taxAmount ? formatCurrency(service.extractedData.costs.taxAmount) : 'N/A'}
                        </span>
                      </div>
                      <Separator />
                      <div className="flex justify-between text-lg font-bold">
                        <span>Total</span>
                        <span>{service.extractedData.costs.totalCost ? formatCurrency(service.extractedData.costs.totalCost) : 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Parts Cost Chart */}
            {service.extractedData?.parts && service.extractedData.parts.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Package className="h-5 w-5" />
                    Parts Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        value: { color: SERVICE_CONFIG.chartColors.partsChart },
                      }}
                    >
                      <BarChart data={getPartsChartData()}>
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                        <YAxis fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill={SERVICE_CONFIG.chartColors.partsChart} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Services Cost Chart */}
            {service.extractedData?.services && service.extractedData.services.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5" />
                    Services Cost
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64">
                    <ChartContainer
                      config={{
                        value: { color: SERVICE_CONFIG.chartColors.servicesChart },
                      }}
                    >
                      <BarChart data={getServicesChartData()}>
                        <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} fontSize={12} />
                        <YAxis fontSize={12} />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar dataKey="value" fill={SERVICE_CONFIG.chartColors.servicesChart} />
                      </BarChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service No</span>
                  <span className="text-sm font-medium">{service.serviceNo || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reference No</span>
                  <span className="text-sm font-medium">{service.refNo || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Registration No</span>
                  <span className="text-sm font-medium">{service.regNo || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service Type</span>
                  <Badge variant="outline">{service.serviceType || 'Unknown'}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Status</span>
                  <Badge className={getStatusColor(service.status)}>
                    {getStatusIcon(service.status)}
                    <span className="ml-1">{service.status || 'Unknown'}</span>
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Priority</span>
                  <Badge className={getPriorityColor(service.priority)}>
                    {service.priority || 'Unknown'}
                  </Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Cost</span>
                  <span className="text-sm font-medium">{service.totalCost ? formatCurrency(service.totalCost) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">{service.createdAt ? formatDate(service.createdAt) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <span className="text-sm font-medium">{service.updatedAt ? formatDate(service.updatedAt) : 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Updated By</span>
                  <span className="text-sm font-medium">{service.updatedBy || 'N/A'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Processing Status */}
            <Card>
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">AI Confidence</span>
                    <span className="text-sm font-medium">
                      {service.invoice?.aiConfidence ? `${Math.round(service.invoice.aiConfidence * 100)}%` : 'N/A'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data Verified</span>
                    <Badge variant={service.isDataVerified ? 'default' : 'secondary'}>
                      {service.isDataVerified ? 'Yes' : 'No'}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Manual Review</span>
                    <Badge variant={service.requiresManualReview ? 'destructive' : 'secondary'}>
                      {service.requiresManualReview ? 'Required' : 'Not Required'}
                    </Badge>
                  </div>
                  {service.invoice?.processingMetrics?.totalTime && (
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Processing Time</span>
                      <span className="text-sm font-medium">
                        {service.invoice.processingMetrics.totalTime.toFixed(2)}s
                      </span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
