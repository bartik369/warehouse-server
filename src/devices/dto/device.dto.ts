import  {} from 'class-validator';

export class DeviceDto {
    inventory_number:   string
    title:              string
    assigned_user:      string
    description:        string 
}

export type TDeviceDto = DeviceDto;