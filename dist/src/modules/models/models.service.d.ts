import { PrismaService } from 'prisma/prisma.service';
import { ModelDto } from './dto/model.dto';
export declare class ModelsService {
    private prisma;
    constructor(prisma: PrismaService);
    getModels(manufacturer: string, type: string): Promise<ModelDto[]>;
    getModelById(id: string): Promise<ModelDto & {
        manufacturer: string;
        type: string;
    }>;
    getAllModels(): Promise<ModelDto[]>;
    createModel(modelDto: ModelDto, file: Express.Multer.File): Promise<ModelDto>;
    updateModel(modelDto: ModelDto, file: Express.Multer.File): Promise<ModelDto>;
    private saveFile;
}
