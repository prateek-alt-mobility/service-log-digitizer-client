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
  createdAt: string;
  description: string;
  id: string;
  isDataVerified: false;
  priority: string;
  refNo: string;
  regNo: string;
  requiresManualReview: boolean;
  serviceNo: string;
  serviceType: string;
  status: string;
  totalCost: number;
  updatedAt: string;
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

interface VehicleInfo {
  vin: string;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
}

interface ServiceItem {
  type: string;
  description: string;
  cost: number;
  laborHours: number | null;
}

interface PartItem {
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface CostBreakdown {
  subtotal: number;
  laborCost: number;
  partsCost: number;
  taxAmount: number | null;
  totalCost: number;
}

interface Warranty {
  parts: string;
  labor: string;
  description: string;
}

interface ExtractedInvoiceData {
  serviceDate: string;
  invoiceNumber: string;
  shopName: string;
  shopAddress: string;
  shopPhone: null;
  vehicleInfo: VehicleInfo;
  services: ServiceItem[];
  parts: PartItem[];
  costs: CostBreakdown;
}
type ExtractedData = {
  serviceDate: string;
  invoiceNumber: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string;
  vehicleInfo: VehicleInfo;
  services: ServiceItem[];
  parts: PartItem[];
  costs: CostBreakdown;
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

type TriggerAIParsingResponse = BaseResponse<{
  serviceId: string;
  extractedData: ExtractedInvoiceData;
  confidence: number;
  processingTime: number;
  requiresManualReview: boolean;
}>;
type SubmitServiceResponse = BaseResponse<{
  message: string;
  serviceId: string;
}>;
enum INVOICE_API_ENDPOINTS {
  GET_DROPDOWN_VEHICLES = '/vehicle?page=1&pageSize=1000',
  UPLOAD_FILE = '/files/pdf-upload',
  CREATE_SERVICE = '/services/upload',
  TRIGGER_AI_PARSING = '/services/:id/process',
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
    triggerAIParsing: builder.mutation<TriggerAIParsingResponse, string>({
      query: (serviceId) => ({
        url: INVOICE_API_ENDPOINTS.TRIGGER_AI_PARSING.replace(':id', serviceId),
        method: 'POST',
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
  useTriggerAIParsingMutation,
} = addInvoiceApi;
