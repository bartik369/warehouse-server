import { DeviceDto } from './dto/device.dto';
import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DevicesService {
    constructor (private prisma: PrismaService) {}
    
    async findAll():Promise<DeviceDto[]> {
        return this.prisma.devices.findMany();
    };

    async findOne(id: string) {
        return this.prisma.devices.findUnique({
            where: {device_id: id}
        });
    };

    async create(deviceDto:DeviceDto) {
        return this.prisma.devices.create({
            data: deviceDto
        });
    };

    async update(id: string, deviceDto) {
        return this.prisma.devices.update ({
            where: {
                device_id: id
            },
            data: deviceDto,
        });
    };

    async remove(id: string) {
        return this.prisma.devices.delete({
            where: {device_id: id}
        });
    };
}
