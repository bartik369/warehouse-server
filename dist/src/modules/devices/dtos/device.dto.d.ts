export declare class DeviceDto {
    id: string;
    name: string;
    inventoryNumber?: string;
    modelId?: string;
    modelCode?: string;
    serialNumber?: string;
    weight?: number;
    screenSize?: number;
    memorySize?: number;
    inStock: boolean;
    isFunctional: boolean;
    price_with_vat: number;
    price_without_vat: number;
    residual_price: number;
    contractorId?: string;
    isAssigned: boolean;
    warehouseId: string;
    description?: string;
    addedById: string;
    updatedById: string;
    lastIssuedAt: Date;
    lastReturnedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    providerName?: string;
    warrantyNumber?: string;
    startWarrantyDate?: string;
    endWarrantyDate?: string;
}
export declare class DeviceModelDto {
    id: string;
    name: string;
    slug: string;
    imagePath: string;
    manufacturerId: string;
    typeId: string;
}
export declare class DeviceTypeDto {
    id: string;
    name: string;
    slug: string;
}
export type TDeviceDto = DeviceDto;
export type TDeviceModelDto = DeviceModelDto;
