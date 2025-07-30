'use client';

import { useState } from 'react';
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
  type ExtractedData as ApiExtractedData,
} from '../add-invoice.api';

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

  const [submitService] = useSubmitServiceMutation();

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
        type: service.type,
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
        catalogMatch: {},
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

  const handleApproved = async () => {
    try {
      setIsSubmitting(true);

      const submitPayload = {
        refNo,
        regNo,
        serviceType,
        priority,
        description,
        extractedData: transformDataForApi(data),
        additionalAttachments: pdfUrl ? [pdfUrl] : [],
        serviceDate: data.serviceDate,
        totalCost: data.costs.totalCost,
        isDataVerified: true,
      };

      await submitService({ id: serviceId, data: submitPayload }).unwrap();

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
                  value={data.serviceDate}
                  onChange={(e) => handleFieldChange('serviceDate', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="invoiceNumber">Invoice Number</Label>
                <Input
                  id="invoiceNumber"
                  value={data.invoiceNumber}
                  onChange={(e) => handleFieldChange('invoiceNumber', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopName">Shop Name</Label>
              <Input
                id="shopName"
                value={data.shopName}
                onChange={(e) => handleFieldChange('shopName', e.target.value)}
                disabled={!isEditing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopAddress">Shop Address</Label>
              <Textarea
                id="shopAddress"
                value={data.shopAddress}
                onChange={(e) => handleFieldChange('shopAddress', e.target.value)}
                disabled={!isEditing}
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="shopPhone">Shop Phone</Label>
              <Input
                id="shopPhone"
                value={data.shopPhone || ''}
                onChange={(e) => handleFieldChange('shopPhone', e.target.value)}
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
                  value={data.vehicleInfo.registrationNumber}
                  onChange={(e) =>
                    handleFieldChange('vehicleInfo.registrationNumber', e.target.value)
                  }
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  value={data.vehicleInfo.vin || ''}
                  onChange={(e) => handleFieldChange('vehicleInfo.vin', e.target.value)}
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
                  value={data.vehicleInfo.make}
                  onChange={(e) => handleFieldChange('vehicleInfo.make', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  value={data.vehicleInfo.model}
                  onChange={(e) => handleFieldChange('vehicleInfo.model', e.target.value)}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  value={data.vehicleInfo.year}
                  onChange={(e) => handleFieldChange('vehicleInfo.year', parseInt(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mileage">Mileage</Label>
              <Input
                id="mileage"
                type="number"
                value={data.vehicleInfo.mileage || ''}
                onChange={(e) =>
                  handleFieldChange(
                    'vehicleInfo.mileage',
                    e.target.value ? parseInt(e.target.value) : null,
                  )
                }
                disabled={!isEditing}
                placeholder="Mileage"
              />
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">Services</h3>
            {data.services.map((service, index) => (
              <div key={index} className="space-y-3 p-3 border rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`service-type-${index}`}>Type</Label>
                    <Input
                      id={`service-type-${index}`}
                      value={service.type}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index].type = e.target.value;
                        setData((prev) => ({ ...prev, services: newServices }));
                      }}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`service-cost-${index}`}>Cost</Label>
                    <Input
                      id={`service-cost-${index}`}
                      type="number"
                      value={service.cost}
                      onChange={(e) => {
                        const newServices = [...data.services];
                        newServices[index].cost = parseFloat(e.target.value);
                        setData((prev) => ({ ...prev, services: newServices }));
                      }}
                      disabled={!isEditing}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`service-description-${index}`}>Description</Label>
                  <Textarea
                    id={`service-description-${index}`}
                    value={service.description}
                    onChange={(e) => {
                      const newServices = [...data.services];
                      newServices[index].description = e.target.value;
                      setData((prev) => ({ ...prev, services: newServices }));
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
            {data.parts.map((part, index) => (
              <div key={index} className="space-y-3 p-3 border rounded-lg">
                <div className="space-y-2">
                  <Label htmlFor={`part-name-${index}`}>Part Name</Label>
                  <Input
                    id={`part-name-${index}`}
                    value={part.name}
                    onChange={(e) => {
                      const newParts = [...data.parts];
                      newParts[index].name = e.target.value;
                      setData((prev) => ({ ...prev, parts: newParts }));
                    }}
                    disabled={!isEditing}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`part-number-${index}`}>Part Number</Label>
                    <Input
                      id={`part-number-${index}`}
                      value={part.partNumber}
                      onChange={(e) => {
                        const newParts = [...data.parts];
                        newParts[index].partNumber = e.target.value;
                        setData((prev) => ({ ...prev, parts: newParts }));
                      }}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`part-quantity-${index}`}>Quantity</Label>
                    <Input
                      id={`part-quantity-${index}`}
                      type="number"
                      value={part.quantity}
                      onChange={(e) => {
                        const newParts = [...data.parts];
                        newParts[index].quantity = parseInt(e.target.value);
                        setData((prev) => ({ ...prev, parts: newParts }));
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
                      value={part.unitCost}
                      onChange={(e) => {
                        const newParts = [...data.parts];
                        newParts[index].unitCost = parseFloat(e.target.value);
                        setData((prev) => ({ ...prev, parts: newParts }));
                      }}
                      disabled={!isEditing}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`part-total-cost-${index}`}>Total Cost</Label>
                    <Input
                      id={`part-total-cost-${index}`}
                      type="number"
                      value={part.totalCost}
                      onChange={(e) => {
                        const newParts = [...data.parts];
                        newParts[index].totalCost = parseFloat(e.target.value);
                        setData((prev) => ({ ...prev, parts: newParts }));
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
                  value={data.costs.subtotal}
                  onChange={(e) => handleFieldChange('costs.subtotal', parseFloat(e.target.value))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="laborCost">Labor Cost</Label>
                <Input
                  id="laborCost"
                  type="number"
                  value={data.costs.laborCost}
                  onChange={(e) => handleFieldChange('costs.laborCost', parseFloat(e.target.value))}
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
                  value={data.costs.partsCost}
                  onChange={(e) => handleFieldChange('costs.partsCost', parseFloat(e.target.value))}
                  disabled={!isEditing}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxAmount">Tax Amount</Label>
                <Input
                  id="taxAmount"
                  type="number"
                  value={data.costs.taxAmount || ''}
                  onChange={(e) =>
                    handleFieldChange(
                      'costs.taxAmount',
                      e.target.value ? parseFloat(e.target.value) : null,
                    )
                  }
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
                value={data.costs.totalCost}
                onChange={(e) => handleFieldChange('costs.totalCost', parseFloat(e.target.value))}
                disabled={!isEditing}
                className="font-semibold"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button onClick={handleApproved} className="flex-1" size="lg" disabled={isSubmitting}>
              <Check className="h-4 w-4 mr-2" />
              Approve
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
