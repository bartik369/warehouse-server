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
import { TypesService } from './types.service';
import { TypeDto } from './dto/type.dto';
import { typeCreated } from 'src/common/utils/constants';

@Controller('types')
export class TypesController {
  constructor(private typesService: TypesService) {}
  @Get()
  async getTypes() {
    return await this.typesService.getTypes();
  }

  // Create device type
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  async createType(@Body() typeDto: TypeDto) {
    const type = await this.typesService.createType(typeDto);
    return {
      message: typeCreated,
      type,
    };
  }
  // GET DEVICE TYPE BY ID
  @Get(':id')
  async getType(@Param('id') id: string) {
    return await this.typesService.getType(id);
  }
  // UPDATE DEVICE TYPE
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateType(@Body() typeDto: TypeDto, @Param('id') id: string) {
    await this.typesService.updateType(typeDto, id);
  }
}
