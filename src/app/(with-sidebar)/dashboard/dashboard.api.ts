import api from '@/store/api';
import { BaseResponse } from '@/types';

// Dashboard Analytics Types
export interface DashboardMetrics {
  overview: {
    totalInvoices: number;
    monthlyInvoices: number;
    successRate: number;
    avgProcessingTime: number;
    totalCost: number;
    monthlyCost: number;
    pendingReviews: number;
    failedProcessing: number;
  };
  trends: {
    monthlyData: MonthlyTrendData[];
    dailyData: DailyTrendData[];
  };
  serviceTypes: ServiceTypeDistribution[];
  vehicleAnalytics: VehicleAnalytics[];
  recentActivity: ActivityItem[];
  costBreakdown: CostBreakdownItem[];
}

export interface MonthlyTrendData {
  month: string;
  invoices: number;
  cost: number;
  processingTime: number;
}

export interface DailyTrendData {
  day: number;
  invoices: number;
  success: number;
  failed: number;
}

export interface ServiceTypeDistribution {
  type: string;
  count: number;
  percentage: number;
  color: string;
}

export interface VehicleAnalytics {
  make: string;
  count: number;
  avgCost: number;
}

export interface ActivityItem {
  id: string;
  type:
    | 'invoice_processed'
    | 'review_required'
    | 'invoice_uploaded'
    | 'processing_failed'
    | 'invoice_approved';
  message: string;
  time: string;
  status: 'success' | 'warning' | 'info' | 'error';
}

export interface CostBreakdownItem {
  category: string;
  amount: number;
  percentage: number;
}

// API Response Types
type GetDashboardAnalyticsResponse = BaseResponse<DashboardMetrics>;

type GetServiceTypeDistributionResponse = BaseResponse<ServiceTypeDistribution[]>;

type GetVehicleAnalyticsResponse = BaseResponse<VehicleAnalytics[]>;

type GetRecentActivityResponse = BaseResponse<ActivityItem[]>;

// API Endpoints
enum DASHBOARD_API_ENDPOINTS {
  GET_DASHBOARD_ANALYTICS = '/dashboard/analytics',
  GET_SERVICE_TYPE_DISTRIBUTION = '/dashboard/service-types',
  GET_VEHICLE_ANALYTICS = '/dashboard/vehicles',
  GET_RECENT_ACTIVITY = '/dashboard/activity',
  EXPORT_DASHBOARD_DATA = '/dashboard/export',
}

// API Slice
export const dashboardApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query<GetDashboardAnalyticsResponse, void>({
      query: () => DASHBOARD_API_ENDPOINTS.GET_DASHBOARD_ANALYTICS,
    }),

    getServiceTypeDistribution: builder.query<GetServiceTypeDistributionResponse, void>({
      query: () => DASHBOARD_API_ENDPOINTS.GET_SERVICE_TYPE_DISTRIBUTION,
    }),

    getVehicleAnalytics: builder.query<GetVehicleAnalyticsResponse, { limit?: number }>({
      query: (params) => ({
        url: DASHBOARD_API_ENDPOINTS.GET_VEHICLE_ANALYTICS,
        params,
      }),
    }),

    getRecentActivity: builder.query<GetRecentActivityResponse, { limit?: number }>({
      query: (params) => ({
        url: DASHBOARD_API_ENDPOINTS.GET_RECENT_ACTIVITY,
        params,
      }),
    }),

    exportDashboardData: builder.mutation<Blob, { format: 'csv' | 'excel' | 'pdf' }>({
      query: (params) => ({
        url: DASHBOARD_API_ENDPOINTS.EXPORT_DASHBOARD_DATA,
        method: 'POST',
        body: params,
        responseHandler: (response) => response.blob(),
      }),
    }),
  }),
});

export const {
  useGetDashboardAnalyticsQuery,
  useGetServiceTypeDistributionQuery,
  useGetVehicleAnalyticsQuery,
  useGetRecentActivityQuery,
  useExportDashboardDataMutation,
} = dashboardApi;

// Mock data generator for development/testing
export const generateMockDashboardData = (): DashboardMetrics => {
  const currentDate = new Date();
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  return {
    overview: {
      totalInvoices: 1247,
      monthlyInvoices: 156,
      successRate: 94.2,
      avgProcessingTime: 2.3,
      totalCost: 287450.75,
      monthlyCost: 23850.25,
      pendingReviews: 12,
      failedProcessing: 8,
    },
    trends: {
      monthlyData: Array.from({ length: 6 }, (_, i) => {
        const monthIndex = (currentDate.getMonth() - 5 + i + 12) % 12;
        return {
          month: monthNames[monthIndex],
          invoices: Math.floor(Math.random() * 100) + 50,
          cost: Math.floor(Math.random() * 20000) + 15000,
          processingTime: Math.round((Math.random() * 2 + 1.5) * 10) / 10,
        };
      }),
      dailyData: Array.from({ length: 30 }, (_, i) => ({
        day: i + 1,
        invoices: Math.floor(Math.random() * 15) + 5,
        success: Math.floor(Math.random() * 3) + 13,
        failed: Math.floor(Math.random() * 2),
      })),
    },
    serviceTypes: [
      { type: 'Preventive Maintenance', count: 456, percentage: 36.6, color: '#3b82f6' },
      { type: 'General Service', count: 398, percentage: 31.9, color: '#10b981' },
      { type: 'Emergency Repair', count: 234, percentage: 18.8, color: '#f59e0b' },
      { type: 'Other', count: 159, percentage: 12.7, color: '#8b5cf6' },
    ],
    vehicleAnalytics: [
      { make: 'Toyota', count: 234, avgCost: 450 },
      { make: 'Honda', count: 189, avgCost: 520 },
      { make: 'Ford', count: 156, avgCost: 680 },
      { make: 'Chevrolet', count: 134, avgCost: 590 },
      { make: 'Nissan', count: 112, avgCost: 470 },
      { make: 'BMW', count: 89, avgCost: 890 },
    ],
    recentActivity: [
      {
        id: '1',
        type: 'invoice_processed',
        message: 'Invoice INV-2024-1247 processed successfully',
        time: '2 minutes ago',
        status: 'success',
      },
      {
        id: '2',
        type: 'review_required',
        message: 'Service SR-2024-0892 requires manual review',
        time: '5 minutes ago',
        status: 'warning',
      },
      {
        id: '3',
        type: 'invoice_uploaded',
        message: 'New invoice uploaded for vehicle ABC-123',
        time: '12 minutes ago',
        status: 'info',
      },
      {
        id: '4',
        type: 'processing_failed',
        message: 'Failed to process invoice INV-2024-1246',
        time: '18 minutes ago',
        status: 'error',
      },
      {
        id: '5',
        type: 'invoice_approved',
        message: 'Service SR-2024-0891 approved and finalized',
        time: '25 minutes ago',
        status: 'success',
      },
    ],
    costBreakdown: [
      { category: 'Labor', amount: 98750, percentage: 34.4 },
      { category: 'Parts', amount: 87230, percentage: 30.3 },
      { category: 'Materials', amount: 56890, percentage: 19.8 },
      { category: 'Other', amount: 44580, percentage: 15.5 },
    ],
  };
};
