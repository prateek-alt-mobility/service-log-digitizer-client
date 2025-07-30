'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { PDFPreview } from '@/components/ui/pdf-preview';
import { toast } from 'sonner';
import { Check, Edit3 } from 'lucide-react';
import {
  useSubmitServiceMutation,
  useUpdateServiceMutation,
  type ExtractedData as ApiExtractedData,
} from '../add-invoice.api';
import { useRouter } from 'next/navigation';

interface VehicleInfo {
  vin: string | null;
  registrationNumber: string;
  make: string;
  model: string;
  year: number;
  mileage: number | null;
}

interface Service {
  type: string;
  description: string;
  cost: number;
  laborHours: number | null;
}

interface Part {
  name: string;
  partNumber: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
}

interface Costs {
  subtotal: number;
  laborCost: number;
  partsCost: number;
  taxAmount: number | null;
  totalCost: number;
}

interface ExtractedData {
  serviceDate: string;
  invoiceNumber: string;
  shopName: string;
  shopAddress: string;
  shopPhone: string | null;
  vehicleInfo: VehicleInfo;
  services: Service[];
  parts: Part[];
  costs: Costs;
}

interface AIProcessingReviewProps {
  extractedData: ExtractedData;
  pdfUrl?: string;
  serviceId: string;
  refNo: string;
  regNo: string;
  serviceType: string;
  priority?: string;
  description?: string;
  onApproved?: (data: ExtractedData) => void;
  onReject?: () => void;
  onSuccess?: () => void;
}

export function AIProcessingReview({
  extractedData,
  pdfUrl,
  serviceId,
  refNo,
  regNo,
  serviceType,
  priority,
  description,
  onApproved,
  onReject,
  onSuccess,
}: AIProcessingReviewProps) {
  const [data, setData] = useState<ExtractedData>(extractedData);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateService] = useUpdateServiceMutation();
  const [submitService] = useSubmitServiceMutation();
  const router = useRouter();
  // Form state variables
  const [serviceDate, setServiceDate] = useState(extractedData.serviceDate || '');
  const [invoiceNumber, setInvoiceNumber] = useState(extractedData.invoiceNumber || '');
  const [shopName, setShopName] = useState(extractedData.shopName || '');
  const [shopAddress, setShopAddress] = useState(extractedData.shopAddress || '');
  const [shopPhone, setShopPhone] = useState(extractedData.shopPhone || '');

  // Vehicle info state variables
  const [registrationNumber, setRegistrationNumber] = useState(
    extractedData.vehicleInfo?.registrationNumber || '',
  );
  const [vin, setVin] = useState(extractedData.vehicleInfo?.vin || '');
  const [make, setMake] = useState(extractedData.vehicleInfo?.make || '');
  const [model, setModel] = useState(extractedData.vehicleInfo?.model || '');
  const [year, setYear] = useState<number>(extractedData.vehicleInfo?.year || 0);
  const [mileage, setMileage] = useState(extractedData.vehicleInfo?.mileage || '');

  // Costs state variables
  const [subtotal, setSubtotal] = useState(extractedData.costs?.subtotal || 0);
  const [laborCost, setLaborCost] = useState(extractedData.costs?.laborCost || 0);
  const [partsCost, setPartsCost] = useState(extractedData.costs?.partsCost || 0);
  const [taxAmount, setTaxAmount] = useState(extractedData.costs?.taxAmount || '');
  const [totalCost, setTotalCost] = useState(extractedData.costs?.totalCost || 0);

  // Services and parts arrays
  const [services, setServices] = useState(extractedData.services || []);
  const [parts, setParts] = useState(extractedData.parts || []);

  // Update data state when form fields change
  useEffect(() => {
    setData((prevData) => ({
      ...prevData,
      serviceDate,
      invoiceNumber,
      shopName,
      shopAddress,
      shopPhone,
      vehicleInfo: {
        ...prevData.vehicleInfo,
        registrationNumber,
        vin,
        make,
        model,
        year, // year is now always a number
        mileage: typeof mileage === 'string' ? parseInt(mileage) || null : mileage,
      },
      costs: {
        ...prevData.costs,
        subtotal,
        laborCost,
        partsCost,
        taxAmount:
          taxAmount === ''
            ? null
            : typeof taxAmount === 'string'
              ? parseFloat(taxAmount) || null
              : taxAmount,
        totalCost,
      },
      services,
      parts,
    }));
  }, [
    serviceDate,
    invoiceNumber,
    shopName,
    shopAddress,
    shopPhone,
    registrationNumber,
    vin,
    make,
    model,
    year,
    mileage,
    subtotal,
    laborCost,
    partsCost,
    taxAmount,
    totalCost,
    services,
    parts,
  ]);

  const handleFieldChange = (path: string, value: any) => {
    setData((prev) => {
      const newData = { ...prev };
      const keys = path.split('.');
      let current: any = newData;

      for (let i = 0; i < keys.length - 1; i++) {
        current = current[keys[i]];
      }

      current[keys[keys.length - 1]] = value;
      return newData;
    });

    // Also update the corresponding state variable
    switch (path) {
      case 'serviceDate':
        setServiceDate(value);
        break;
      case 'invoiceNumber':
        setInvoiceNumber(value);
        break;
      case 'shopName':
        setShopName(value);
        break;
      case 'shopAddress':
        setShopAddress(value);
        break;
      case 'shopPhone':
        setShopPhone(value);
        break;
      case 'vehicleInfo.registrationNumber':
        setRegistrationNumber(value);
        break;
      case 'vehicleInfo.vin':
        setVin(value);
        break;
      case 'vehicleInfo.make':
        setMake(value);
        break;
      case 'vehicleInfo.model':
        setModel(value);
        break;
      case 'vehicleInfo.year':
        setYear(typeof value === 'number' ? value : 0);
        break;
      case 'vehicleInfo.mileage':
        setMileage(value);
        break;
      case 'costs.subtotal':
        setSubtotal(value);
        break;
      case 'costs.laborCost':
        setLaborCost(value);
        break;
      case 'costs.partsCost':
        setPartsCost(value);
        break;
      case 'costs.taxAmount':
        setTaxAmount(value);
        break;
      case 'costs.totalCost':
        setTotalCost(value);
        break;
    }
  };

  const transformDataForApi = (localData: ExtractedData): ApiExtractedData => {
    return {
      serviceDate: localData.serviceDate,
      invoiceNumber: localData.invoiceNumber,
      shopName: localData.shopName,
      shopAddress: localData.shopAddress,
      shopPhone: localData.shopPhone || '',
      vehicleInfo: {
        vin: localData.vehicleInfo.vin || '',
        licensePlate: localData.vehicleInfo.registrationNumber,
        registrationNumber: localData.vehicleInfo.registrationNumber,
        make: localData.vehicleInfo.make,
        model: localData.vehicleInfo.model,
        year: localData.vehicleInfo.year,
        mileage: localData.vehicleInfo.mileage || 0,
      },
      services: localData.services.map((service) => ({
        type: 'MAINTENANCE',
        //service.type,
        description: service.description,
        cost: service.cost,
        laborHours: service.laborHours || 0,
      })),
      parts: localData.parts.map((part) => ({
        name: part.name,
        partNumber: part.partNumber,
        quantity: part.quantity,
        unitCost: part.unitCost,
        totalCost: part.totalCost,
        matchConfidence: 0,
      })),
      costs: {
        subtotal: localData.costs.subtotal,
        laborCost: localData.costs.laborCost,
        partsCost: localData.costs.partsCost,
        taxAmount: localData.costs.taxAmount || 0,
        totalCost: localData.costs.totalCost,
      },
      warranty: {
        parts: '',
        labor: '',
        description: '',
      },
    };
  };

  const handleEdit = async () => {
    try {
      setIsSubmitting(true);

      const submitPayload = {
        refNo,
        regNo,
        serviceType: serviceType || 'OTHER',
        priority: priority || 'NORMAL',
        description: description || '',
        extractedData: transformDataForApi(data),
        additionalAttachments: pdfUrl ? [pdfUrl] : [],
        serviceDate: data.serviceDate,
        totalCost: data.costs.totalCost,
        isDataVerified: true,
      };
      console.log(submitPayload);

      await updateService({ id: serviceId, payload: submitPayload }).unwrap();
      setIsEditing(false);
      setIsSubmitting(false);
      await submitService({ id: serviceId, isDataVerified: true }).unwrap();
      toast.success('Service submitted successfully');

      if (onApproved) {
        onApproved(data);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting service:', error);
      toast.error('Failed to submit service');
    } finally {
      setIsSubmitting(false);
      router.push('/');
    }
  };

  const handleApproval = async () => {
    try {
      setIsSubmitting(true);

      await submitService({ id: serviceId, isDataVerified: true }).unwrap();

      toast.success('Service submitted successfully');

      if (onApproved) {
        onApproved(data);
      }

      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error submitting service:', error);
      toast.error('Failed to submit service');
    } finally {
      setIsSubmitting(false);
      router.push('/');
    }
  };

  const handleReject = () => {
    if (onReject) {
      onReject();
    }
    toast.error('Invoice data rejected');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
      {/* PDF Preview Section */}
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            PDF Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="h-[calc(100%-80px)]">
          <PDFPreview fileUrl={pdfUrl} fileName="Invoice" size="large" className="h-full" />
        </CardContent>
      </Card>

      {/* Extracted Data Section */}
      <Card className="h-full overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Check className="h-4 w-4" />
              Extracted Data
            </span>
            <Button variant="outline" size="sm" onClick={() => setIsEditing(!isEditing)}>
              {isEditing ? 'View' : 'Edit'}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Basic Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="serviceDate">Service Date</Label>
                <Input
                  id="serviceDate"
                  type="date"
                  value={serviceDate}
                  onChange={(e) => {
                    setServiceDate(e.target.value);
                    handleFieldChange('serviceDate', e.target.value);
                  }}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={invoiceNumber}
                  onChange={(e) => {
                    setInvoiceNumber(e.target.value);
                    handleFieldChange('invoiceNumber', e.target.value);
                  }}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={shopName}
                onChange={(e) => {
                  setShopName(e.target.value);
                  handleFieldChange('shopName', e.target.value);
                }}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopAddress">Shop Address</Label>
              <Textarea
                id="shopAddress"
                value={shopAddress}
                onChange={(e) => {
                  setShopAddress(e.target.value);
                  handleFieldChange('shopAddress', e.target.value);
                }}
                disabled={!isEditing}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopPhone">Shop Phone</Label>
              <Input
                id="shopPhone"
                value={shopPhone}
                onChange={(e) => {
                  setShopPhone(e.target.value);
                  handleFieldChange('shopPhone', e.target.value);
                }}
                disabled={!isEditing}
                placeholder="Phone number"
              />
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Vehicle Information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registrationNumber">Registration Number</Label>
                <Input
                  id="registrationNumber"
                  value={registrationNumber}
                  onChange={(e) => {
                    setRegistrationNumber(e.target.value);
                    handleFieldChange('vehicleInfo.registrationNumber', e.target.value);
                  }}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  value={vin}
                  onChange={(e) => {
                    setVin(e.target.value);
                    handleFieldChange('vehicleInfo.vin', e.target.value);
                  }}
                  disabled={!isEditing}
                  placeholder="VIN number"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="make">Make</Label>
                <Input
                  id="make"
                  value={make}
                  onChange={(e) => {
                    setMake(e.target.value);
                    handleFieldChange('vehicleInfo.make', e.target.value);
                  }}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={model}
                  onChange={(e) => {
                    setModel(e.target.value);
                    handleFieldChange('vehicleInfo.model', e.target.value);
                  }}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={year}
                  onChange={(e) => {
                    const parsedYear = parseInt(e.target.value) || 0;
                    setYear(parsedYear);
                    handleFieldChange('vehicleInfo.year', parsedYear);
                  }}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={mileage}
                onChange={(e) => {
                  setMileage(e.target.value);
                  handleFieldChange(
                    'vehicleInfo.mileage',
                    e.target.value ? parseInt(e.target.value) : null,
                  );
                }}
                disabled={!isEditing}
                placeholder="Mileage"
              />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Services</h3>
            {services.map((service, index) => (
              <div key={index} className="space-y-3 p-3 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`service-type-${index}`}>Type</Label>
                    <Input
                      id={`service-type-${index}`}
                      value={service?.type || ''}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[index].type = e.target.value;
                        setServices(newServices);
                      }}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`service-cost-${index}`}>Cost</Label>
                    <Input
                      id={`service-cost-${index}`}
                      type="number"
                      value={service?.cost || 0}
                      onChange={(e) => {
                        const newServices = [...services];
                        newServices[index].cost = parseFloat(e.target.value);
                        setServices(newServices);
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`service-description-${index}`}>Description</Label>
                  <Textarea
                    id={`service-description-${index}`}
                    value={service?.description || ''}
                    onChange={(e) => {
                      const newServices = [...services];
                      newServices[index].description = e.target.value;
                      setServices(newServices);
                    }}
                    disabled={!isEditing}
                    rows={2}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Parts */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Parts</h3>
            {parts.map((part, index) => (
              <div key={index} className="space-y-3 p-3 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor={`part-name-${index}`}>Part Name</Label>
                  <Input
                    id={`part-name-${index}`}
                    value={part?.name || ''}
                    onChange={(e) => {
                      const newParts = [...parts];
                      newParts[index].name = e.target.value;
                      setParts(newParts);
                    }}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`part-number-${index}`}>Part Number</Label>
                    <Input
                      id={`part-number-${index}`}
                      value={part?.partNumber || ''}
                      onChange={(e) => {
                        const newParts = [...parts];
                        newParts[index].partNumber = e.target.value;
                        setParts(newParts);
                      }}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`part-quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`part-quantity-${index}`}
                      type="number"
                      value={part?.quantity || 0}
                      onChange={(e) => {
                        const newParts = [...parts];
                        newParts[index].quantity = parseInt(e.target.value);
                        setParts(newParts);
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`part-unit-cost-${index}`}>Unit Cost</Label>
                    <Input
                      id={`part-unit-cost-${index}`}
                      type="number"
                      value={part?.unitCost || 0}
                      onChange={(e) => {
                        const newParts = [...parts];
                        newParts[index].unitCost = parseFloat(e.target.value);
                        setParts(newParts);
                      }}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`part-total-cost-${index}`}>Total Cost</Label>
                    <Input
                      id={`part-total-cost-${index}`}
                      type="number"
                      value={part?.totalCost || 0}
                      onChange={(e) => {
                        const newParts = [...parts];
                        newParts[index].totalCost = parseFloat(e.target.value);
                        setParts(newParts);
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Costs Summary */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Costs Summary</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="subtotal">Subtotal</Label>
                <Input
                  id="subtotal"
                  type="number"
                  value={subtotal}
                  onChange={(e) => {
                    setSubtotal(parseFloat(e.target.value) || 0);
                    handleFieldChange('costs.subtotal', parseFloat(e.target.value) || 0);
                  }}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="laborCost">Labor Cost</Label>
                <Input
                  id="laborCost"
                  type="number"
                  value={laborCost}
                  onChange={(e) => {
                    setLaborCost(parseFloat(e.target.value) || 0);
                    handleFieldChange('costs.laborCost', parseFloat(e.target.value) || 0);
                  }}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="partsCost">Parts Cost</Label>
                <Input
                  id="partsCost"
                  type="number"
                  value={partsCost}
                  onChange={(e) => {
                    setPartsCost(parseFloat(e.target.value) || 0);
                    handleFieldChange('costs.partsCost', parseFloat(e.target.value) || 0);
                  }}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxAmount">Tax Amount</Label>
                <Input
                  id="taxAmount"
                  type="number"
                  value={taxAmount}
                  onChange={(e) => {
                    setTaxAmount(e.target.value);
                    handleFieldChange(
                      'costs.taxAmount',
                      e.target.value ? parseFloat(e.target.value) : null,
                    );
                  }}
                  disabled={!isEditing}
                  placeholder="Tax amount"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalCost">Total Cost</Label>
              <Input
                id="totalCost"
                type="number"
                value={totalCost}
                onChange={(e) => {
                  setTotalCost(parseFloat(e.target.value) || 0);
                  handleFieldChange('costs.totalCost', parseFloat(e.target.value) || 0);
                }}
                disabled={!isEditing}
                className="font-semibold"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={() => {
                if (isEditing) {
                  handleEdit();
                } else {
                  handleApproval();
                }
              }}
              className="flex-1"
              size="lg"
              disabled={isSubmitting}
            >
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
