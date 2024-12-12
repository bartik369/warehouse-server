import  {} from 'class-validator';

export class DeviceDto {
    id:                 string
    serialNumber:       string
    modelCode:          string
    inventoryNumber:    string
    title:              string
    type:               string
    manufacturer:       string
    weight:             string
    media:              string
    serviceable:        boolean
    inStock:            boolean
    locationId:         string
    assignedTo:         string
    createdBy:          string
    updatedBy:          string
    createdAt:          Date
    updatedAt:          Date

}

export type TDeviceDto = DeviceDto;