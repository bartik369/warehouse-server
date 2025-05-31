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
import { typeCreated, updatedTypeMsg } from 'src/common/utils/constants';
import { FormDataOnlyInterceptor } from 'src/common/interceptors/form-data.interceptor';
import { CreateTypeDto } from './dto/create-type.dto';
import { TypeBaseDto } from './dto/type-base.dto';
import { UpdateTypeDto } from './dto/update-type.dto';

@Controller('types')
export class TypesController {
  constructor(private typesService: TypesService) {}
  // Get all
  @Get()
  async getTypes(): Promise<TypeBaseDto[]> {
    return await this.typesService.getTypes();
  }

  // Create device type
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  @FormDataOnlyInterceptor()
  async createType(
    @Body() typeDto: CreateTypeDto,
  ): Promise<{ message: string; type: TypeBaseDto }> {
    const type = await this.typesService.createType(typeDto);
    return {
      message: typeCreated,
      type,
    };
  }
  // GET DEVICE TYPE BY ID
  @Get(':id')
  async getType(@Param('id') id: string): Promise<TypeBaseDto> {
    return await this.typesService.getType(id);
  }

  // UPDATE DEVICE TYPE
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  async updateType(
    @Body() typeDto: UpdateTypeDto,
    @Param('id') id: string,
  ): Promise<{ message: string; updatedType: TypeBaseDto }> {
    const updatedType = await this.typesService.updateType(typeDto, id);
    return {
      message: updatedTypeMsg,
      updatedType,
    };
  }
}
