import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ManufacturersService } from './manufacturers.service';
import { ManufacturerDto } from './dto/manufacturer.dto';
import { manufacturerCreated } from 'src/common/utils/constants';
import { FormDataOnlyInterceptor } from 'src/common/interceptors/form-data.interceptor';

@Controller('manufacturers')
export class ManufacturersController {
  constructor(private manufacturersService: ManufacturersService) {}
  // Create device manufacturer
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @FormDataOnlyInterceptor()
  @HttpCode(HttpStatus.CREATED)
  async createManufacturer(@Body() manufacturerDto: ManufacturerDto) {
    const manufacturer =
      await this.manufacturersService.createManufacturer(manufacturerDto);
    return {
      message: manufacturerCreated,
      manufacturer,
    };
  }

  // Get devices manufacturers
  @Get()
  async getManufacturers() {
    return await this.manufacturersService.getManufacturers();
  }
  // Get  manufacturer
  @Get(':id')
  async getManufacturer(@Param('id') id: string) {
    return await this.manufacturersService.getManufacturer(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  async updateManufacturer(
    @Param('id') id: string,
    @Body() manufacturerDto: ManufacturerDto,
  ) {
    return await this.manufacturersService.updateManufacturer(
      id,
      manufacturerDto,
    );
  }
}
