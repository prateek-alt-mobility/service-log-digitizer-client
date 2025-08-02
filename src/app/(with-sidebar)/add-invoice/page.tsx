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
  useTriggerAIParsingMutation,
  ExtractedData,
} from './add-invoice.api';
import { Card, CardContent } from '@/components/ui/card';
import {
  Loader2,
  FileText,
  ScanSearch,
  ListChecks,
  Wrench,
  ShoppingCart,
  Calculator,
  CheckCircle,
  Bot,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AIProcessingReview } from './components/ai-processing-review';

const bypass = false;

// Custom keyframes animation for subtle bounce
const bounceAnimation = {
  '0%, 100%': { transform: 'translateY(0)' },
  '50%': { transform: 'translateY(-10%)' },
};

const AIParsingLoader = () => {
  const [currentStage, setCurrentStage] = useState(0);
  const [progressWidth, setProgressWidth] = useState(12.5); // Start with first stage width

  const stages = [
    {
      text: 'Initializing AI parsing engine',
      icon: Bot,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500',
    },
    {
      text: 'Scanning invoice document',
      icon: ScanSearch,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-500',
    },
    {
      text: 'Extracting line items',
      icon: ListChecks,
      color: 'text-violet-500',
      bgColor: 'bg-violet-500',
    },
    {
      text: 'Identifying service details',
      icon: Wrench,
      color: 'text-purple-500',
      bgColor: 'bg-purple-500',
    },
    {
      text: 'Detecting parts information',
      icon: ShoppingCart,
      color: 'text-pink-500',
      bgColor: 'bg-pink-500',
    },
    {
      text: 'Calculating cost breakdown',
      icon: Calculator,
      color: 'text-rose-500',
      bgColor: 'bg-rose-500',
    },
    {
      text: 'Verifying extracted data',
      icon: FileText,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500',
    },
    {
      text: 'Finalizing results',
      icon: CheckCircle,
      color: 'text-green-500',
      bgColor: 'bg-green-500',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prevStage) => {
        const nextStage = (prevStage + 1) % stages.length;
        // Update progress width based on the next stage
        setProgressWidth(((nextStage + 1) * 100) / stages.length);
        return nextStage;
      });
    }, 2500);

    return () => clearInterval(interval);
  }, [stages.length]);

  const CurrentIcon = stages[currentStage].icon;

  return (
    <Card className="w-full max-w-md mx-auto mt-10 overflow-hidden">
      <CardContent className="pt-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative h-20 w-20">
            {/* Spinning background loader */}
            <Loader2 className="h-20 w-20 absolute inset-0 animate-spin text-muted-foreground opacity-30" />

            {/* Animated icon transition */}
            <div className="absolute inset-0 flex items-center justify-center">
              <CurrentIcon
                className={cn(
                  'h-10 w-10 transition-all duration-500 ease-in-out',
                  stages[currentStage].color,
                )}
                style={{ animation: 'bounce 2s infinite ease-in-out' }}
              />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-lg font-medium">Processing Invoice</h3>
            <p
              className={cn(
                'text-sm transition-all duration-500 ease-in-out',
                stages[currentStage].color,
              )}
            >
              {stages[currentStage].text}...
            </p>
          </div>

          <div className="w-full space-y-2">
            <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-2 rounded-full transition-all duration-1000 ease-in-out',
                  stages[currentStage].bgColor,
                )}
                style={{
                  width: `${progressWidth}%`,
                }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>
                Step {currentStage + 1}/{stages.length}
              </span>
              <span>{Math.round(progressWidth)}% complete</span>
            </div>
          </div>

          <p className="text-xs text-muted-foreground animate-pulse">This may take a few moments</p>
        </div>
      </CardContent>

      <style jsx global>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10%);
          }
        }
      `}</style>
    </Card>
  );
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

  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [invoicePdfUrl, setInvoicePdfUrl] = useState<string>('');
  const [serviceId, setServiceId] = useState<string>('');
  const [refNo, setRefNo] = useState<string>('');
  const [regNo, setRegNo] = useState<string>('');
  const [serviceType, setServiceType] = useState<string>('');
  const [priority, setPriority] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const [uploadFile, { isLoading: isUploading }] = useUploadFileMutation();
  const [createService] = useCreateServiceMutation();
  const [isAIParsing, setIsAIParsing] = useState(false);
  const [isParseSuccess, setIsParseSuccess] = useState(false);
  const [triggerAIParsing, { isError: isAIParsingError }] = useTriggerAIParsingMutation();
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
      // Step 1: Upload the invoice PDF to the server
      const invoicePdfUrl = response.data.link;

      // Step 2: Create the service
      setIsAIParsing(true);
      const addInvoiceResponse = await createService({
        fileUrl: invoicePdfUrl,
        fileName: data.invoicePdf[0].name,
        refNo: data.regNo + ' - ' + data.serviceType,
        regNo: data.regNo,
        serviceType: data.serviceType,
        description: data.description || '',
      });

      // Step 3: Trigger the AI parsing
      const serviceId = addInvoiceResponse.data?.data.id;
      if (!serviceId) throw new Error('Service ID is required');
      const aiParsingResponse = await triggerAIParsing(serviceId).unwrap();

      setExtractedData(aiParsingResponse.data.extractedData as any);
      setInvoicePdfUrl(invoicePdfUrl);
      setServiceId(serviceId);
      setIsParseSuccess(true);
      setIsAIParsing(false);
      setRefNo(data.regNo + ' - ' + data.serviceType);
      setRegNo(data.regNo);
      setServiceType(data.serviceType);
      setPriority('');
      setDescription(data.description || '');

      if (addInvoiceResponse.error) throw new Error('Error adding invoice');
      toast.success('Invoice added successfully');
    } catch (error) {
      console.log(error);
      toast.error('Error uploading invoice');
    }
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

  return (
    <div>
      {isAIParsing && !isAIParsingError ? (
        <AIParsingLoader />
      ) : isParseSuccess ? (
        <div>
          <AIProcessingReview
            extractedData={extractedData!}
            pdfUrl={invoicePdfUrl}
            serviceId={serviceId}
            refNo={refNo}
            regNo={regNo}
            serviceType={serviceType}
            priority={priority}
            description={description}
            onApproved={() => {}}
            onReject={() => {}}
            onSuccess={() => {}}
          />
        </div>
      ) : (
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
            <Button type="submit" className="w-full" disabled={isUploading}>
              {isUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Upload Invoice'}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AddInvoicePage;
