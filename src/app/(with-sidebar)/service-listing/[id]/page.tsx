'use client';

import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { PDFPreview } from '@/components/ui/pdf-preview';
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
  ExternalLink
} from 'lucide-react';
import { useGetServicesQuery } from '../service.api';
import { ServiceItem } from '../service.api';

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
}

function getPriorityColor(priority: string) {
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
}

export default function ServiceDetail() {
  const params = useParams();
  const router = useRouter();
  const serviceId = params.id as string;
  
  // Use Redux Toolkit Query hook
  const { data: apiResponse, isLoading, error } = useGetServicesQuery();
  
  const services = apiResponse?.data?.data || [];
  const service = services.find(s => s._id === serviceId);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileSize = (url: string) => {
    // This would typically come from the API, but for now we'll estimate
    return '2.4 MB';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-2">Service Not Found</h1>
          <p className="text-muted-foreground mb-4">
            {error && 'data' in error && typeof error.data === 'object' && error.data && 'message' in error.data 
              ? String(error.data.message) 
              : 'The requested service could not be found.'}
          </p>
          <Button onClick={() => router.push('/service-listing')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => router.push('/service-listing')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Services
          </Button>
          
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {service.invoice?.fileName || service.serviceNo}
              </h1>
              <div className="flex items-center gap-4 text-muted-foreground mb-4">
                <div className="flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  <span>{service.refNo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>{service.createdBy}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(service.createdAt)}</span>
                </div>
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
                        {service.invoice?.fileName || service.serviceNo}
                      </h3>
                      <div className="space-y-1 text-sm text-muted-foreground text-center">
                        <div>Status: {service.invoice?.processingStatus || 'PDF'}</div>
                        <div>Size: {getFileSize(service.invoice?.fileUrl || '')}</div>
                        <div>Uploaded: {formatDate(service.invoice?.uploadedAt || service.createdAt)}</div>
                      </div>
                    </div>
                    
                    {/* PDF Preview */}
                    <PDFPreview
                      fileUrl={service.invoice?.fileUrl}
                      fileName={service.invoice?.fileName || service.serviceNo}
                      size="medium"
                      showActions={true}
                    />
                  </div>
                </CardContent>
            </Card>

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
                        <label className="text-sm font-medium text-muted-foreground">Invoice Number</label>
                        <p className="text-sm">{service.extractedData.invoiceNumber}</p>
                      </div>
                    )}
                    {service.extractedData.shopName && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Shop Name</label>
                        <p className="text-sm">{service.extractedData.shopName}</p>
                      </div>
                    )}
                    {service.extractedData.shopAddress && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Shop Address</label>
                        <p className="text-sm">{service.extractedData.shopAddress}</p>
                      </div>
                    )}
                    {service.extractedData.shopPhone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Shop Phone</label>
                        <p className="text-sm">{service.extractedData.shopPhone}</p>
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
          
            {/* Service Information */}
            <Card>
              <CardHeader>
                <CardTitle>Service Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service No</span>
                  <span className="text-sm font-medium">{service.serviceNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Reference No</span>
                  <span className="text-sm font-medium">{service.refNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Registration No</span>
                  <span className="text-sm font-medium">{service.regNo}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Service Type</span>
                  <Badge variant="outline">{service.serviceType}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Cost</span>
                  <span className="text-sm font-medium">₹{service.totalCost || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Created</span>
                  <span className="text-sm font-medium">{formatDate(service.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Updated</span>
                  <span className="text-sm font-medium">{formatDate(service.updatedAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Updated By</span>
                  <span className="text-sm font-medium">{service.updatedBy}</span>
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
                    <span className="text-sm font-medium">{service.invoice?.aiConfidence || 0}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Data Verified</span>
                    <Badge variant={service.isDataVerified ? "default" : "secondary"}>
                      {service.isDataVerified ? "Yes" : "No"}
                    </Badge>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Manual Review</span>
                    <Badge variant={service.requiresManualReview ? "destructive" : "secondary"}>
                      {service.requiresManualReview ? "Required" : "Not Required"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
} 