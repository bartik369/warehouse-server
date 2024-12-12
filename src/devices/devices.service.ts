import { DeviceDto } from './dto/device.dto';
import { TDeviceDto } from './dto/device.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DevicesService {
    constructor (private prisma: PrismaService) {}
    
    async findAll():Promise<any> {
        console.log('test find devices');
        const devices = await this.prisma.device.findMany()
        return devices
    };

    // async update(id: string, deviceDto:DeviceDto) {
    //     return this.prisma.device.update ({
    //         where: {
    //             device_id: id
    //         },
    //         data: deviceDto,
    //     });
    // };

    // async remove(id: string) {
    //     return this.prisma.device.delete({
    //         where: {device_id: id}
    //     });
    // };
}
