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
            user: {
                locationId: string;
                id: string;
                userName: string;
                email: string;
                workId: string | null;
                firstNameRu: string;
                lastNameRu: string;
                firstNameEn: string;
                lastNameEn: string;
                isActive: boolean;
                departmentId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            issuedBy: {
                locationId: string;
                id: string;
                userName: string;
                email: string;
                workId: string | null;
                firstNameRu: string;
                lastNameRu: string;
                firstNameEn: string;
                lastNameEn: string;
                isActive: boolean;
                departmentId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            comment: string | null;
            id: string;
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
                locationId: string;
                id: string;
                userName: string;
                email: string;
                workId: string | null;
                firstNameRu: string;
                lastNameRu: string;
                firstNameEn: string;
                lastNameEn: string;
                isActive: boolean;
                departmentId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
            returnedBy: {
                locationId: string;
                id: string;
                userName: string;
                email: string;
                workId: string | null;
                firstNameRu: string;
                lastNameRu: string;
                firstNameEn: string;
                lastNameEn: string;
                isActive: boolean;
                departmentId: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            comment: string | null;
            id: string;
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
        name: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        inventoryNumber: string | null;
        modelId: string | null;
        modelCode: string | null;
        serialNumber: string | null;
        weight: number | null;
        screenSize: number | null;
        memorySize: number | null;
        inStock: boolean;
        isFunctional: boolean;
        price_with_vat: import("@prisma/client/runtime/library").Decimal | null;
        price_without_vat: import("@prisma/client/runtime/library").Decimal | null;
        residual_price: import("@prisma/client/runtime/library").Decimal | null;
        isAssigned: boolean;
        warehouseId: string | null;
        description: string | null;
        addedById: string;
        updatedById: string;
        lastIssuedAt: Date | null;
        lastReturnedAt: Date | null;
    })[]>;
    getOptions(city: string): Promise<IDeviceOptions>;
    createDevice(deviceDto: CreateDeviceDto): Promise<Partial<DeviceBaseDto>>;
    updateDevice(deviceId: string, deviceDto: UpdateDeviceDto): Promise<DeviceBaseDto>;
    warrantyAction: (deviceDto: UpdateDeviceDto, id: string, deviceId: string) => Promise<void>;
}
