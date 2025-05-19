import { ModelsService } from './models.service';
import { ModelDto } from './dto/model.dto';
export declare class ModelsController {
    private modelsService;
    constructor(modelsService: ModelsService);
    getModelById(id: string): Promise<ModelDto & {
        manufacturer: string;
        type: string;
    }>;
    getModels(manufacturer: string, type: string): Promise<ModelDto[]>;
    getAllModels(): Promise<ModelDto[]>;
    createModel(file: Express.Multer.File, body: Record<string, string>): Promise<{
        message: string;
        model: ModelDto;
    }>;
    updateModel(file: Express.Multer.File, body: Record<string, string>): Promise<{
        message: string;
        updatedModel: ModelDto;
    }>;
}
