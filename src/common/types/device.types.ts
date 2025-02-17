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
        screenSize:number;
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
    inStock: boolean,
    isFunctional:boolean;
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
