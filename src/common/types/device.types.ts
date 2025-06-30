import { Decimal } from '@prisma/client/runtime/library';

export interface IFilteredDevices {
  id: string;
  name: string;
  screenSize: number;
  memorySize: number;
  isFunctional: boolean;
  isAssigned: boolean;
  inventoryNumber: string;
  serialNumber: string;
  warehouse: {
    name: string;
    slug: string;
  };
  model: {
    name: string;
    slug: string;
    type: {
      name: string;
      slug: string;
    };
    manufacturer: {
      name: string;
      slug: string;
    };
  };
}

export interface IDeviceOptions {
  manufacturer: {
    name: string;
    slug: string;
  }[];
  type: {
    name: string;
    slug: string;
  }[];
  model: {
    name: string;
    slug: string;
  }[];
  warehouse: {
    name: string;
    slug: string;
  }[];
  screenSize: {
    screenSize: number;
  }[];
  memorySize: {
    memorySize: number;
  }[];
  isFunctional: {
    isFunctional: boolean;
  }[];
  isAssigned: {
    isAssigned: boolean;
  }[];
}
export interface IDeviceOptionsModel {
  model: IDeviceOptions[];
}

export interface IDevice {
  id: string;
  name: string;
  inventoryNumber?: string;
  modelCode?: string;
  modelId?: string;
  modelName?: string;
  serialNumber?: string;
  weight?: number;
  screenSize?: number | null;
  memorySize?: number | null;
  inStock: boolean;
  isFunctional: boolean;
  isAssigned: boolean;
  warehouseId: string;
  warehouseName: string;
  description?: string;
  type: string;
  typeId: string;
  manufacturer?: string;
  addedById: string;
  updatedById: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IDeviceIssue {
  user: {
    firstNameEn: string;
    lastNameEn: string;
  };
}
export interface IAggregatedDeviceInfo {
  lastIssuedAt: Date;
  lastReturnedAt: Date;
  price_without_vat: Decimal;
  price_with_vat: Decimal;
  residual_price: Decimal;
  warehouse: {
    name: string;
  };
  model: {
    name: string;
    imagePath: string;
    manufacturer: {
      name: string;
      slug: string;
    };
    type: {
      name: string;
      slug: string;
    };
  };
  warranty: {
    warrantyNumber: string;
    startWarrantyDate: Date;
    endWarrantyDate: Date;
    warrantyStatus: string;
    isExpired: boolean;
    contractor: {
      name: string;
    };
  };
  // deviceIssues: {
  //   firstNameEn: string;
  //   lastNameEn: string;
  // }[];
  addedBy: { firstNameEn: string; lastNameEn: string };
  updatedBy: { firstNameEn: string; lastNameEn: string };
}
