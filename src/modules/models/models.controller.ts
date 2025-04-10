import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ModelsService } from './models.service';
import { FileUploadInterceptor } from '../../common/interceptors/file-upload.interceptor';
import {
  allowedPictureOptions,
  modelCreated,
} from 'src/common/utils/constants';
import { ModelDto } from './dto/model.dto';
import { plainToInstance } from 'class-transformer';

@Controller('models')
export class ModelsController {
  constructor(private modelsService: ModelsService) {}
  @Get('/single/:id')
  async getModelById(@Param('id') id: string) {
    const model = await this.modelsService.getModelById(id);
    return model;
  }

  @Get('/united/:manufacturer/:type')
  async getModel(
    @Param('manufacturer') manufacturer: string,
    @Param('type') type: string,
  ) {
    return await this.modelsService.getModels(manufacturer, type);
  }
  @Get('/all')
  async getAllModels() {
    return await this.modelsService.getAllModels();
  }

  // Create device model
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  @FileUploadInterceptor(allowedPictureOptions)
  async createModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Record<string, string>,
  ) {
    const modelDto = plainToInstance(ModelDto, body);
    const model = await this.modelsService.createModel(modelDto, file);
    return {
      message: modelCreated,
      model,
    };
  }
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  @FileUploadInterceptor(allowedPictureOptions)
  async updateModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Record<string, string>,
  ) {
    const modelDto = plainToInstance(ModelDto, body);
    return await this.modelsService.updateModel(modelDto, file);
  }
}
