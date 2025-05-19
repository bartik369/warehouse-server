import { DeviceDto } from './dtos/device.dto';
import { IAggregatedDeviceInfo, IDeviceOptions, IFilteredDevices } from 'src/common/types/device.types';
import { DevicesService } from './devices.service';
export declare class DevicesController {
    private devicesService;
    constructor(devicesService: DevicesService);
    createDevice(deviceDto: DeviceDto): Promise<{
        message: string;
        device: Partial<DeviceDto>;
    }>;
    findAll(city: string, query: Record<string, string>): Promise<{
        devices: IFilteredDevices[];
        totalPages: number;
    }>;
    getOptions(city: string): Promise<IDeviceOptions>;
    getDevice(id: string): Promise<IAggregatedDeviceInfo>;
    updateDevice(id: string, deviceDto: DeviceDto): Promise<{
        message: string;
        updatedDevice: DeviceDto;
    }>;
}
