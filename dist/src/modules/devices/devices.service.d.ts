import { IDeviceOptions, IDevice, IAggregatedDeviceInfo, IFilteredDevices } from 'src/common/types/device.types';
import { PrismaService } from 'prisma/prisma.service';
import { DeviceDto } from './dtos/device.dto';
export declare class DevicesService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(query: Record<string, string>, city: string): Promise<{
        devices: IFilteredDevices[];
        totalPages: number;
    }>;
    getDevice(id: string): Promise<IAggregatedDeviceInfo>;
    deviceHistory(): Promise<({
        deviceIssues: ({
            user: {
                id: string;
                locationId: string;
                userName: string;
                email: string;
                workId: string | null;
                firstNameRu: string;
                lastNameRu: string;
                firstNameEn: string;
                lastNameEn: string;
                departmentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            issuedBy: {
                id: string;
                locationId: string;
                userName: string;
                email: string;
                workId: string | null;
                firstNameRu: string;
                lastNameRu: string;
                firstNameEn: string;
                lastNameEn: string;
                departmentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            comment: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            deviceId: string | null;
            processId: number;
            issuedById: string | null;
            issueDate: Date;
            status: string;
        })[];
        deviceReturns: ({
            user: {
                id: string;
                locationId: string;
                userName: string;
                email: string;
                workId: string | null;
                firstNameRu: string;
                lastNameRu: string;
                firstNameEn: string;
                lastNameEn: string;
                departmentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
            returnedBy: {
                id: string;
                locationId: string;
                userName: string;
                email: string;
                workId: string | null;
                firstNameRu: string;
                lastNameRu: string;
                firstNameEn: string;
                lastNameEn: string;
                departmentId: string | null;
                isActive: boolean;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            comment: string | null;
            createdAt: Date;
            updatedAt: Date;
            userId: string | null;
            deviceId: string | null;
            processId: number;
            returnedById: string | null;
            returnDate: Date;
            condition: string | null;
        })[];
    } & {
        id: string;
        name: string;
        createdAt: Date;
        updatedAt: Date;
        inventoryNumber: string | null;
        modelId: string | null;
        modelCode: string | null;
        serialNumber: string | null;
        weight: number | null;
        screenSize: number | null;
        memorySize: number | null;
        price_with_vat: import("@prisma/client/runtime/library").Decimal | null;
        price_without_vat: import("@prisma/client/runtime/library").Decimal | null;
        residual_price: import("@prisma/client/runtime/library").Decimal | null;
        warehouseId: string | null;
        description: string | null;
        addedById: string;
        isFunctional: boolean;
        isAssigned: boolean;
        inStock: boolean;
        updatedById: string;
        lastIssuedAt: Date | null;
        lastReturnedAt: Date | null;
    })[]>;
    getOptions(city: string): Promise<IDeviceOptions>;
    createDevice(deviceDto: DeviceDto): Promise<Partial<IDevice>>;
    updateDevice(deviceId: string, deviceDto: DeviceDto): Promise<DeviceDto>;
    warrantyAction: (deviceDto: DeviceDto, id: string, deviceId: string) => Promise<void>;
}
