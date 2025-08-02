'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ResponsiveContainer,
} from 'recharts';
import {
  FileText,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  Plus,
  Download,
  RefreshCw,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
} from 'lucide-react';
import Link from 'next/link';

// Mock data for analytics dashboard
const dashboardMetrics = {
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
    monthlyData: [
      { month: 'Jan', invoices: 89, cost: 18750, processingTime: 2.1 },
      { month: 'Feb', invoices: 112, cost: 21200, processingTime: 2.4 },
      { month: 'Mar', invoices: 145, cost: 28900, processingTime: 2.2 },
      { month: 'Apr', invoices: 134, cost: 26800, processingTime: 2.5 },
      { month: 'May', invoices: 178, cost: 31450, processingTime: 2.1 },
      { month: 'Jun', invoices: 156, cost: 23850, processingTime: 2.3 },
    ],
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

const chartConfig = {
  invoices: {
    label: 'Invoices',
    color: 'hsl(var(--chart-1))',
  },
  cost: {
    label: 'Cost (₹)',
    color: 'hsl(var(--chart-2))',
  },
  processingTime: {
    label: 'Processing Time (min)',
    color: 'hsl(var(--chart-3))',
  },
  success: {
    label: 'Successful',
    color: 'hsl(var(--chart-4))',
  },
  failed: {
    label: 'Failed',
    color: 'hsl(var(--chart-5))',
  },
};

function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendValue,
}: {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: any;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {trend && trendValue && (
          <div className="flex items-center pt-1">
            <TrendingUp
              className={`h-3 w-3 mr-1 ${
                trend === 'up'
                  ? 'text-green-500'
                  : trend === 'down'
                    ? 'text-red-500'
                    : 'text-yellow-500'
              }`}
            />
            <span
              className={`text-xs ${
                trend === 'up'
                  ? 'text-green-500'
                  : trend === 'down'
                    ? 'text-red-500'
                    : 'text-yellow-500'
              }`}
            >
              {trendValue}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function QuickActionsCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Link href="/add-invoice" className="block">
          <Button className="w-full justify-start" variant="outline">
            <Plus className="mr-2 h-4 w-4" />
            Add New Invoice
          </Button>
        </Link>
        <Link href="/service-listing?status=PENDING_REVIEW" className="block">
          <Button className="w-full justify-start" variant="outline">
            <Clock className="mr-2 h-4 w-4" />
            Review Pending ({dashboardMetrics.overview.pendingReviews})
          </Button>
        </Link>
        <Button className="w-full justify-start" variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Analytics
        </Button>
        <Button className="w-full justify-start" variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Sync Data
        </Button>
      </CardContent>
    </Card>
  );
}

function RecentActivityFeed() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'invoice_processed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'review_required':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'invoice_uploaded':
        return <FileText className="h-4 w-4 text-blue-500" />;
      case 'processing_failed':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'invoice_approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {dashboardMetrics.recentActivity.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="mt-0.5">{getActivityIcon(activity.type)}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{activity.message}</p>
                <p className="text-xs text-muted-foreground">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4">
          <Link href="/service-listing">
            <Button variant="outline" size="sm" className="w-full">
              View All Activity
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your service invoice processing and business insights
          </p>
        </div>

        {/* Key Metrics Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Invoices"
            value={dashboardMetrics.overview.totalInvoices.toLocaleString()}
            subtitle={`+${dashboardMetrics.overview.monthlyInvoices} this month`}
            icon={FileText}
            trend="up"
            trendValue="+12.5%"
          />
          <MetricCard
            title="AI Success Rate"
            value={`${dashboardMetrics.overview.successRate}%`}
            subtitle="Processing accuracy"
            icon={Zap}
            trend="up"
            trendValue="+2.1%"
          />
          <MetricCard
            title="Avg Processing Time"
            value={`${dashboardMetrics.overview.avgProcessingTime}m`}
            subtitle="Per invoice"
            icon={Clock}
            trend="down"
            trendValue="-15%"
          />
          <MetricCard
            title="Total Cost Processed"
            value={`₹${(dashboardMetrics.overview.totalCost / 1000).toFixed(0)}K`}
            subtitle={`+₹${(dashboardMetrics.overview.monthlyCost / 1000).toFixed(0)}K this month`}
            icon={DollarSign}
            trend="up"
            trendValue="+8.2%"
          />
        </div>

        {/* Charts Section */}
        <Tabs defaultValue="trends" className="mb-8">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trends" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Trends
            </TabsTrigger>
            <TabsTrigger value="distribution" className="flex items-center gap-2">
              <PieChartIcon className="h-4 w-4" />
              Distribution
            </TabsTrigger>

            <TabsTrigger value="costs" className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Costs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="trends" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Invoice Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <LineChart data={dashboardMetrics.trends.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line
                        type="monotone"
                        dataKey="invoices"
                        stroke="var(--color-invoices)"
                        strokeWidth={2}
                        dot={{ fill: 'var(--primary)' }}
                      />
                    </LineChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Processing Performance */}
              <Card>
                <CardHeader>
                  <CardTitle>Daily Processing Performance</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <AreaChart data={dashboardMetrics.trends.dailyData.slice(-14)}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Area
                        type="monotone"
                        dataKey="success"
                        stackId="1"
                        stroke="var(--primary)"
                        fill="var(--primary)"
                        fillOpacity={0.6}
                      />
                      <Area
                        type="monotone"
                        dataKey="failed"
                        stackId="1"
                        stroke="var(--secondary)"
                        fill="var(--secondary)"
                        fillOpacity={0.6}
                      />
                    </AreaChart>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="distribution" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Service Type Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Service Type Distribution</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <PieChart>
                      <Pie
                        data={dashboardMetrics.serviceTypes}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="count"
                        label={({ type, percentage }) => `${type}: ${percentage}%`}
                      >
                        {dashboardMetrics.serviceTypes.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Status Distribution */}
              <Card>
                <CardHeader>
                  <CardTitle>Invoice Status Breakdown</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">Completed</span>
                    </div>
                    <div className="text-sm font-medium">1,095 (87.8%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Processing</span>
                    </div>
                    <div className="text-sm font-medium">89 (7.1%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Pending Review</span>
                    </div>
                    <div className="text-sm font-medium">55 (4.4%)</div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-sm">Failed</span>
                    </div>
                    <div className="text-sm font-medium">8 (0.7%)</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="costs" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Monthly Cost Trends */}
              <Card>
                <CardHeader>
                  <CardTitle>Monthly Cost Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig}>
                    <BarChart data={dashboardMetrics.trends.monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="cost" fill="var(--primary)" />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>

              {/* Cost Breakdown */}
              <Card>
                <CardHeader>
                  <CardTitle>Cost Breakdown by Category</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {dashboardMetrics.costBreakdown.map((item, index) => (
                    <div key={item.category} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{item.category}</span>
                        <span className="text-sm text-muted-foreground">
                          ₹{item.amount.toLocaleString()} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-secondary rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RecentActivityFeed />
          </div>
          <div>
            <QuickActionsCard />
          </div>
        </div>
      </div>
    </div>
  );
}
