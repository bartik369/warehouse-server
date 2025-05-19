import { TypesService } from './types.service';
import { TypeDto } from './dto/type.dto';
export declare class TypesController {
    private typesService;
    constructor(typesService: TypesService);
    getTypes(): Promise<{
        id: string;
        name: string;
        slug: string;
    }[]>;
    createType(typeDto: TypeDto): Promise<{
        message: string;
        type: {
            id: string;
            name: string;
            slug: string;
        };
    }>;
    getType(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
    }>;
    updateType(typeDto: TypeDto, id: string): Promise<void>;
}
