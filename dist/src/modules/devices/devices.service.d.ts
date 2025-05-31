import { IDeviceOptions, IAggregatedDeviceInfo, IFilteredDevices } from 'src/common/types/device.types';
import { PrismaService } from 'prisma/prisma.service';
import { CreateDeviceDto } from './dtos/create-device.dto';
import { DeviceBaseDto } from './dtos/device-base.dto';
import { UpdateDeviceDto } from './dtos/update-device.dto';
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
            issuedBy: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userName: string;
                email: string;
                workId: string | null;
                firstNameEn: string;
                lastNameEn: string;
                isActive: boolean;
                locationId: string;
                firstNameRu: string;
                lastNameRu: string;
                departmentId: string | null;
            };
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userName: string;
                email: string;
                workId: string | null;
                firstNameEn: string;
                lastNameEn: string;
                isActive: boolean;
                locationId: string;
                firstNameRu: string;
                lastNameRu: string;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            processId: number;
            deviceId: string | null;
            userId: string | null;
            issuedById: string | null;
            issueDate: Date;
            status: string;
            comment: string | null;
        })[];
        deviceReturns: ({
            user: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userName: string;
                email: string;
                workId: string | null;
                firstNameEn: string;
                lastNameEn: string;
                isActive: boolean;
                locationId: string;
                firstNameRu: string;
                lastNameRu: string;
                departmentId: string | null;
            };
            returnedBy: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userName: string;
                email: string;
                workId: string | null;
                firstNameEn: string;
                lastNameEn: string;
                isActive: boolean;
                locationId: string;
                firstNameRu: string;
                lastNameRu: string;
                departmentId: string | null;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            processId: number;
            deviceId: string | null;
            userId: string | null;
            comment: string | null;
            returnedById: string | null;
            returnDate: Date;
            condition: string | null;
        })[];
    } & {
        id: string;
        name: string;
        inventoryNumber: string | null;
        modelId: string | null;
        modelCode: string | null;
        serialNumber: string | null;
        weight: number | null;
        screenSize: number | null;
        memorySize: number | null;
        inStock: boolean;
        isFunctional: boolean;
        isAssigned: boolean;
        warehouseId: string | null;
        description: string | null;
        addedById: string;
        updatedById: string;
        lastIssuedAt: Date | null;
        lastReturnedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        price_without_vat: import("@prisma/client/runtime/library").Decimal | null;
        price_with_vat: import("@prisma/client/runtime/library").Decimal | null;
        residual_price: import("@prisma/client/runtime/library").Decimal | null;
    })[]>;
    getOptions(city: string): Promise<IDeviceOptions>;
    createDevice(deviceDto: CreateDeviceDto): Promise<Partial<DeviceBaseDto>>;
    updateDevice(deviceId: string, deviceDto: UpdateDeviceDto): Promise<DeviceBaseDto>;
    warrantyAction: (deviceDto: UpdateDeviceDto, id: string, deviceId: string) => Promise<void>;
}
