// Service listing configuration
export const SERVICE_CONFIG = {
  // Currency configuration
  currency: {
    locale: 'en-IN',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },

  // Date formatting
  dateFormat: {
    locale: 'en-US',
    options: {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  },

  // Chart colors
  chartColors: {
    costBreakdown: {
      parts: '#3b82f6',
      labor: '#10b981',
      tax: '#f59e0b',
    },
    partsChart: '#3b82f6',
    servicesChart: '#10b981',
  },

  // Chart dimensions
  chartDimensions: {
    pieChart: {
      height: '12rem', // h-48
      innerRadius: 40,
      outerRadius: 80,
      paddingAngle: 5,
    },
    barChart: {
      height: '16rem', // h-64
      xAxisHeight: 80,
      fontSize: 12,
      angle: -45,
    },
  },

  // Status configurations
  statuses: {
    COMPLETED: {
      icon: 'CheckCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    APPROVED: {
      icon: 'CheckCircle',
      color: 'text-green-600',
      bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    IN_PROGRESS: {
      icon: 'Clock',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    PROCESSING: {
      icon: 'Clock',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    },
    DRAFT: {
      icon: 'File',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    PENDING_REVIEW: {
      icon: 'AlertCircle',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    },
    PENDING: {
      icon: 'AlertCircle',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300',
    },
    REJECTED: {
      icon: 'AlertCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
    FAILED: {
      icon: 'AlertCircle',
      color: 'text-red-600',
      bgColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
    DEFAULT: {
      icon: 'Clock',
      color: 'text-gray-600',
      bgColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    },
  },

  // Priority configurations
  priorities: {
    HIGH: {
      bgColor: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
    },
    MEDIUM: {
      bgColor: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    },
    NORMAL: {
      bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    LOW: {
      bgColor: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
    },
    DEFAULT: {
      bgColor: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    },
  },

  // UI constants
  ui: {
    maxWidth: 'max-w-7xl',
    padding: 'p-6',
    chartHeight: {
      pie: 'h-48',
      bar: 'h-64',
    },
    defaultFileSize: '2.4 MB',
  },

  // Navigation
  navigation: {
    backRoute: '/service-listing',
  },

  // Labels and text
  labels: {
    loading: 'Loading service details...',
    notFound: 'Service Not Found',
    notFoundMessage: 'The requested service could not be found.',
    backToServices: 'Back to Services',
    documentPreview: 'Document Preview',
    vehicleInformation: 'Vehicle Information',
    services: 'Services',
    parts: 'Parts',
    description: 'Description',
    extractedInformation: 'Extracted Information',
    processingError: 'Processing Error',
    costBreakdown: 'Cost Breakdown',
    costDistribution: 'Cost Distribution',
    partsCost: 'Parts Cost',
    servicesCost: 'Services Cost',
    serviceInformation: 'Service Information',
    processingStatus: 'Processing Status',
    total: 'Total',
    subtotal: 'Subtotal',
    tax: 'Tax',
    serviceNo: 'Service No',
    referenceNo: 'Reference No',
    registrationNo: 'Registration No',
    serviceType: 'Service Type',
    status: 'Status',
    priority: 'Priority',
    totalCost: 'Total Cost',
    created: 'Created',
    updated: 'Updated',
    updatedBy: 'Updated By',
    aiConfidence: 'AI Confidence',
    dataVerified: 'Data Verified',
    manualReview: 'Manual Review',
    processingTime: 'Processing Time',
    required: 'Required',
    notRequired: 'Not Required',
    yes: 'Yes',
    no: 'No',
    vin: 'VIN',
    registration: 'Registration',
    make: 'Make',
    model: 'Model',
    mileage: 'Mileage',
    year: 'Year',
    serviceTypeLabel: 'Service Type',
    descriptionLabel: 'Description',
    costLabel: 'Cost',
    laborHoursLabel: 'Labor Hours',
    partNameLabel: 'Part Name',
    partNumberLabel: 'Part Number',
    qtyLabel: 'Qty',
    unitCostLabel: 'Unit Cost',
    totalCostLabel: 'Total Cost',
    sizeLabel: 'Size',
    uploadedLabel: 'Uploaded',
    invoiceNumberLabel: 'Invoice Number',
    shopNameLabel: 'Shop Name',
    shopAddressLabel: 'Shop Address',
    shopPhoneLabel: 'Shop Phone',
  },
} as const; 