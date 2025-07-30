'use client';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { FormGlobalSelect } from '@/components/ui/form-global-select';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  useCreateServiceMutation,
  useGetDropdownVehiclesQuery,
  useUploadFileMutation,
} from './add-invoice.api';
import { AIProcessingReview } from './components/ai-processing-review';

// Mock extracted data - in real implementation, this would come from the AI processing
const mockExtractedData = {
  serviceDate: '2024-01-15',
  invoiceNumber: 'INV-2024-001',
  shopName: 'AutoCare Center',
  shopAddress: '123 Main Street, City, State 12345',
  shopPhone: '+1-555-0123',
  vehicleInfo: {
    vin: '1HGBH41JXMN109186',
    registrationNumber: 'ABC123',
    make: 'Honda',
    model: 'Civic',
    year: 2020,
    mileage: 50000,
  },
  services: [
    {
      type: 'OIL_CHANGE',
      description: 'Full synthetic oil change with filter replacement',
      cost: 75.0,
      laborHours: 1.0,
    },
  ],
  parts: [
    {
      name: 'Synthetic Oil 5W-30',
      partNumber: 'SYN-5W30-5QT',
      quantity: 1,
      unitCost: 45.0,
      totalCost: 45.0,
    },
    {
      name: 'Oil Filter',
      partNumber: 'OF-HONDA-2020',
      quantity: 1,
      unitCost: 15.0,
      totalCost: 15.0,
    },
  ],
  costs: {
    subtotal: 135.0,
    laborCost: 75.0,
    partsCost: 60.0,
    taxAmount: 10.8,
    totalCost: 145.8,
  },
};

const AddInvoicePage = () => {
  const [vehicleOptions, setVehicleOptions] = useState<{ label: string; value: string }[]>([]);
  const [serviceTypeOptions, setServiceTypeOptions] = useState<{ label: string; value: string }[]>([
    {
      label: 'Other',
      value: 'OTHER',
    },
    {
      label: 'Preventive Maintenance',
      value: 'PREVENTIVE',
    },
    {
      label: 'General',
      value: 'GENERAL',
    },
  ]);
  const [isAIProcessing, setIsAIProcessing] = useState(false);
  const [showAIReview, setShowAIReview] = useState(false);
  const [currentServiceId, setCurrentServiceId] = useState<string>('');
  const [currentPdfUrl, setCurrentPdfUrl] = useState<string>('');
  const [currentFormData, setCurrentFormData] = useState<any>(null);

  const [uploadFile] = useUploadFileMutation();
  const [createService] = useCreateServiceMutation();

  const uploadInvoiceValidationSchema = z.object({
    regNo: z.string().min(1, 'Registration number is required'),
    serviceType: z.string().min(1, 'Service type is required'),
    invoicePdf: z.any().refine((value) => value instanceof FileList && value.length > 0, {
      message: 'Please upload an invoice PDF',
    }),
    description: z.string().optional(),
  });

  type FormValues = z.infer<typeof uploadInvoiceValidationSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(uploadInvoiceValidationSchema),
    defaultValues: {
      regNo: '',
      serviceType: 'OTHER',
      description: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    try {
      if (!data.invoicePdf) throw new Error('Invoice PDF is required');
      const formData = new FormData();
      formData.append('file', data.invoicePdf[0]);
      const response = await uploadFile(formData).unwrap();
      const invoicePdfUrl = response.data.link;

      const addInvoiceResponse = await createService({
        fileUrl: invoicePdfUrl,
        fileName: data.invoicePdf[0].name,
        regNo: data.regNo,
        refNo: data.regNo + ' - ' + data.serviceType,
        serviceType: data.serviceType,
        description: data.description || '',
      });

      setIsAIProcessing(true);
      await new Promise((resolve) => setTimeout(resolve, 10000));
      setIsAIProcessing(false);

      if (addInvoiceResponse.error) throw new Error('Error adding invoice');

      // Store the data for AI review
      setCurrentServiceId('mock-service-id-' + Date.now()); // In real implementation, this would come from the API response
      setCurrentPdfUrl(invoicePdfUrl);
      setCurrentFormData(data);
      setShowAIReview(true);

      toast.success('Invoice uploaded successfully. Please review the extracted data.');
    } catch (error) {
      toast.error('Error uploading invoice');
    }
  };

  const handleAIReviewSuccess = () => {
    setShowAIReview(false);
    setCurrentServiceId('');
    setCurrentPdfUrl('');
    setCurrentFormData(null);
    form.reset();
    toast.success('Service submitted successfully!');
  };

  const handleAIReviewReject = () => {
    setShowAIReview(false);
    setCurrentServiceId('');
    setCurrentPdfUrl('');
    setCurrentFormData(null);
    toast.info('Service rejected. You can upload a new invoice.');
  };

  const { data: dropdownVehicleData } = useGetDropdownVehiclesQuery();
  const vehicles = dropdownVehicleData?.data?.data;

  useEffect(() => {
    if (vehicles) {
      const options = vehicles.map((vehicle) => ({
        label: vehicle.regNo,
        value: vehicle.regNo,
      }));
      setVehicleOptions(options);
    }
  }, [vehicles]);

  if (showAIReview && currentFormData) {
    return (
      <div className="h-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-2">Review Extracted Data</h1>
          <p className="text-muted-foreground">
            Review and edit the extracted invoice data before submitting.
          </p>
        </div>

        <div className="h-[calc(100vh-200px)]">
          <AIProcessingReview
            extractedData={mockExtractedData}
            pdfUrl={currentPdfUrl}
            serviceId={currentServiceId}
            refNo={currentFormData.regNo + ' - ' + currentFormData.serviceType}
            regNo={currentFormData.regNo}
            serviceType={currentFormData.serviceType}
            priority="MEDIUM"
            description={currentFormData.description}
            onSuccess={handleAIReviewSuccess}
            onReject={handleAIReviewReject}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      {isAIProcessing ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Processing invoice...</p>
            <p className="text-sm text-muted-foreground">AI is extracting data from your invoice</p>
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6">
            <h1 className="text-2xl font-bold mb-2">Add Invoice</h1>
            <p className="text-muted-foreground">
              Upload an invoice PDF to extract service information automatically.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="regNo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Registration Number</FormLabel>
                    <FormControl>
                      <FormGlobalSelect
                        name="regNo"
                        control={form.control}
                        options={vehicleOptions}
                        placeholder="Select a vehicle"
                        className="w-full"
                        required
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <FormControl>
                      <FormGlobalSelect
                        name="serviceType"
                        control={form.control}
                        options={serviceTypeOptions}
                        placeholder="Select a service type"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="invoicePdf"
                render={({ field: { onChange, value, ...fieldProps } }) => (
                  <FormItem>
                    <FormLabel>Invoice PDF</FormLabel>
                    <FormControl>
                      <Input
                        type="file"
                        accept="application/pdf"
                        onChange={(e) => onChange(e.target.files)}
                        {...fieldProps}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Upload Invoice
              </Button>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
};

export default AddInvoicePage;
