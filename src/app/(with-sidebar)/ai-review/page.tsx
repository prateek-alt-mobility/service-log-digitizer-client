'use client';

import { AIProcessingReview } from '../add-invoice/components/ai-processing-review';
import { toast } from 'sonner';

// Mock data for demonstration
const mockExtractedData = {
  serviceDate: '2020-10-24',
  invoiceNumber: 'Oct/2020/190',
  shopName: 'STARLINE',
  shopAddress: 'Garage Galli, Babasaheb Ambedkar Nagar, Dadar West, Mumbai-400028',
  shopPhone: null,
  vehicleInfo: {
    vin: null,
    registrationNumber: 'RJ06 CC7651',
    make: 'Maruti',
    model: 'CIAZ SHVS VDI+',
    year: 2016,
    mileage: null,
  },
  services: [
    {
      type: 'Service',
      description: 'Labour, service and fitting charges',
      cost: 7500,
      laborHours: null,
    },
  ],
  parts: [
    {
      name: 'CEAT Milaze_X3 145/80 R 13 Tubeless 75 T Car Tyre',
      partNumber: '3573621',
      quantity: 2,
      unitCost: 2949,
      totalCost: 5898,
    },
    {
      name: 'Exide FCP0-EXCP36R(MF)',
      partNumber: 'FCP0-EXCP36R(MF)',
      quantity: 1,
      unitCost: 4599,
      totalCost: 4599,
    },
    {
      name: 'Trak N Tell Intelli7 K10 Car Tracking System',
      partNumber: '1783182',
      quantity: 1,
      unitCost: 6599,
      totalCost: 6599,
    },
  ],
  costs: {
    subtotal: 24596,
    laborCost: 7500,
    partsCost: 17096,
    taxAmount: null,
    totalCost: 24596,
  },
};

// Mock PDF URL - you can replace this with a real PDF URL
const mockPdfUrl = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';

const AIReviewPage = () => {
  const handleApproved = (approvedData: any) => {
    // Here you would typically save the approved data to your backend
    console.log('Approved data:', approvedData);
    toast.success('Invoice data approved and saved successfully');
  };

  const handleReject = () => {
    toast.info('Invoice data rejected. You can upload a new invoice.');
  };

  const handleSuccess = () => {
    // Handle successful submission - could redirect or show success message
    console.log('Service submitted successfully');
  };

  return (
    <div className="h-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">AI Invoice Review</h1>
        <p className="text-muted-foreground">
          Review and edit the extracted invoice data before approving.
        </p>
      </div>

      <div className="h-[calc(100vh-200px)]">
        <AIProcessingReview
          extractedData={mockExtractedData}
          pdfUrl={mockPdfUrl}
          serviceId="mock-service-id-123"
          refNo="RJ06 CC7651 - Service"
          regNo="RJ06 CC7651"
          serviceType="GENERAL"
          priority="MEDIUM"
          description="Regular service and maintenance"
          onApproved={handleApproved}
          onReject={handleReject}
          onSuccess={handleSuccess}
        />
      </div>
    </div>
  );
};

export default AIReviewPage;
