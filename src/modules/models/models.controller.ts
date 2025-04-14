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
  modelUpdated,
} from 'src/common/utils/constants';
import { ModelDto } from './dto/model.dto';
import { plainToInstance } from 'class-transformer';

@Controller('models')
export class ModelsController {
  constructor(private modelsService: ModelsService) {}
  // Get by ID
  @Get('/single/:id')
  async getModelById(
    @Param('id') id: string,
  ): Promise<ModelDto & { manufacturer: string; type: string }> {
    const model = await this.modelsService.getModelById(id);
    return model;
  }

  @Get('/united/:manufacturer/:type')
  async getModels(
    @Param('manufacturer') manufacturer: string,
    @Param('type') type: string,
  ): Promise<ModelDto[]> {
    return await this.modelsService.getModels(manufacturer, type);
  }
  @Get('/all')
  async getAllModels() {
    return await this.modelsService.getAllModels();
  }

  // Create
  @Post()
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.CREATED)
  @FileUploadInterceptor(allowedPictureOptions)
  async createModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Record<string, string>,
  ): Promise<{ message: string; model: ModelDto }> {
    const modelDto = plainToInstance(ModelDto, body);
    const model = await this.modelsService.createModel(modelDto, file);
    return {
      message: modelCreated,
      model,
    };
  }
  // Update
  @Put(':id')
  @UsePipes(new ValidationPipe({ whitelist: true }))
  @HttpCode(HttpStatus.OK)
  @FileUploadInterceptor(allowedPictureOptions)
  async updateModel(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Record<string, string>,
  ): Promise<{ message: string; updatedModel: ModelDto }> {
    const modelDto = plainToInstance(ModelDto, body);
    const updatedModel = await this.modelsService.updateModel(modelDto, file);
    return {
      message: modelUpdated,
      updatedModel,
    };
  }
}
