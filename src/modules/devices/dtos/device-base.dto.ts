export class DeviceBaseDto {
  id: string;
  name: string;
  inventoryNumber: string | null;
  modelCode: string | null;
  modelId: string | null;
  serialNumber: string | null;
  weight: number | null;
  screenSize: number | null;
  memorySize: number | null;
  inStock: boolean;
  isFunctional: boolean;
  isAssigned: boolean;
  assignedUserId: string | null;
  warehouseId: string | null;
  description: string | null;
  addedById: string;
  updatedById: string;
  lastIssuedAt: Date | null;
  lastReturnedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  price_with_vat: number | null;
  price_without_vat: number | null;
  residual_price: number | null;
  model: {
    id: string;
    name: string;
    slug: string;

    manufacturer: {
      id: string;
      name: string;
      slug: string;
    };

    type: {
      id: string;
      name: string;
      slug: string;
    };
  } | null;
  warehouse: {
    id: string;
    name: string;
    slug: string;
    locationId: string | null;
  } | null;
  warranty: {
    warrantyNumber: string;
    startWarrantyDate: Date;
    endWarrantyDate: Date;
    provider: string;
    contractorId: string | null;
    contractor: {
      id: string;
      name: string;
      slug: string;
    } | null;
  } | null;
}
