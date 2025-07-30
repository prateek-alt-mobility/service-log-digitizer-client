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
  // const [isAIError, setIsAIError] = useState(false);

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
      toast.success('Invoice added successfully');
    } catch (error) {
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
      {isAIProcessing ? (
        <div>Processing...</div>
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
            <Button type="submit" className="w-full">
              Upload Invoice
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

export default AddInvoicePage;
