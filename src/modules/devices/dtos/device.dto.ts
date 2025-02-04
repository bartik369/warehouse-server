import  {} from 'class-validator';

export class DeviceDto {
    id:                 string
    name:               string
    inventoryNumber:    string
    modelId:            string
    modelCode:          string
    serialNumber:       string
    weight:             number
    screenSize:         number
    memorySize:         number
    inStock:            boolean
    isFunctional:       boolean
    isAssigned:         boolean
    warehouseId:        string
    description:        string
    addedById:          string
    updatedById:        string 
    lastIssuedAt:       Date
    lastReturnedAt:     Date
    createdAt:          Date
    updatedAt:          Date
}
export class DeviceModelDto {
    name:               string
    slug:               string
    imagePath:          string
    manufacturerId:     string
    typeId:             string
}

export type TDeviceDto = DeviceDto;
export type TDeviceModelDto = DeviceModelDto;