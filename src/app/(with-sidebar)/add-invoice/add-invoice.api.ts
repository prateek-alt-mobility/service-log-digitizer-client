import api from '@/store/api';
import { BaseResponse } from '@/types';

type GetDropdownVehiclesResponse = BaseResponse<{
  data: {
    _id: string;
    userId: string;
    vehicleCategory: string;
    regNo: string;
    vin: string;
    model_name: string;
    brand: string;
    color: string;
    year: number;
    fuelType: string;
    engineNumber: string;
    chassisNumber: string;
    purchaseDate: string;
    registrationDate: string;
    insuranceNumber: string;
    insuranceExpiryDate: string;
    createdAt: string;
    updatedAt: string;
    createdBy: string;
    updatedBy: string;
    __v: number;
  }[];
  meta_data: {
    search_query: string;
    page: number;
    page_size: number;
    count: number;
  };
}>;
type UploadFileResponse = BaseResponse<{
  message: string;
  link: string;
  fileName: string;
  fileSize: number;
  contentType: string;
}>;
type CreateServiceResponse = BaseResponse<{
  message: string;
}>;
type CreateServicePayload = {
  fileUrl: string;
  fileName: string;
  refNo: string;
  regNo: string;
  serviceType: string;
  priority?: string;
  description?: string;
};

// New types for submit service
type SubmitServiceResponse = BaseResponse<{
  message: string;
  serviceId: string;
}>;

type VehicleInfo = {
  vin: string;
  licensePlate: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  mileage: number;
};

type ServiceItem = {
  type: string;
  description: string;
  cost: number;
  laborHours: number;
};

type PartItem = {
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  catalogMatch?: Record<string, any>;
  matchConfidence?: number;
};

type Costs = {
  subtotal: number;
  laborCost: number;
  partsCost: number;
  taxAmount: number;
  totalCost: number;
};

type Warranty = {
  parts: string;
  labor: string;
  description: string;
};

type ExtractedData = {
  serviceDate: string;
  invoiceNumber: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  vehicleInfo: VehicleInfo;
  services: ServiceItem[];
  parts: PartItem[];
  costs: Costs;
  warranty: Warranty;
};

type SubmitServicePayload = {
  refNo: string;
  regNo: string;
  serviceType: string;
  priority?: string;
  description?: string;
  extractedData: ExtractedData;
  additionalAttachments?: string[];
  serviceDate: string;
  totalCost: number;
  isDataVerified: boolean;
};

enum INVOICE_API_ENDPOINTS {
  GET_DROPDOWN_VEHICLES = '/vehicle?page=1&pageSize=1000',
  UPLOAD_FILE = '/files/pdf-upload',
  CREATE_SERVICE = 'services/upload',
  SUBMIT_SERVICE = 'services/{id}/submit',
}

export const addInvoiceApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getDropdownVehicles: builder.query<GetDropdownVehiclesResponse, void>({
      query: () => INVOICE_API_ENDPOINTS.GET_DROPDOWN_VEHICLES,
    }),
    uploadFile: builder.mutation<UploadFileResponse, FormData>({
      query: (file) => ({
        url: INVOICE_API_ENDPOINTS.UPLOAD_FILE,
        method: 'POST',
        body: file,
        formData: true,
      }),
    }),
    createService: builder.mutation<CreateServiceResponse, CreateServicePayload>({
      query: (data) => ({
        url: INVOICE_API_ENDPOINTS.CREATE_SERVICE,
        method: 'POST',
        body: data,
      }),
    }),
    submitService: builder.mutation<
      SubmitServiceResponse,
      { id: string; data: SubmitServicePayload }
    >({
      query: ({ id, data }) => ({
        url: INVOICE_API_ENDPOINTS.SUBMIT_SERVICE.replace('{id}', id),
        method: 'POST',
        body: data,
      }),
    }),
  }),
});

export const {
  useGetDropdownVehiclesQuery,
  useUploadFileMutation,
  useCreateServiceMutation,
  useSubmitServiceMutation,
} = addInvoiceApi;

// Export types for use in components
export type {
  SubmitServicePayload,
  ExtractedData,
  VehicleInfo,
  ServiceItem,
  PartItem,
  Costs,
  Warranty,
};
