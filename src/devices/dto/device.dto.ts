import  {} from 'class-validator';

export class DeviceDto {
    id:                 string
    name:               string
    inventoryNumber:    string
    type:               string
    manufacturer:       string
    modelCode:          string
    serialNumber:       string
    media:              string
    weight:             string
    screenSize:         number
    memorySize:         number
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
    typeId:             string
}

export type TDeviceDto = DeviceDto;
export type TDeviceModelDto = DeviceModelDto;