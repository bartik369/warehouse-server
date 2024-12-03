import { DeviceDto } from './dto/device.dto';
import { PrismaService } from 'src/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DevicesService {
    constructor (private prisma: PrismaService) {}
    
    // async findAll():Promise<DeviceDto[]> {
    //     return this.prisma.device.findMany();
    // };

    // async findOne(id: string) {
    //     return this.prisma.device.findUnique({
    //         where: {device_id: id}
    //     });
    // };

    async create(deviceDto:DeviceDto) {
        console.log(deviceDto);
        
        // return this.prisma.device.create({
        //     data: deviceDto
        // });
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
