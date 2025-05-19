import { PrismaService } from 'prisma/prisma.service';
import { TypeDto } from './dto/type.dto';
export declare class TypesService {
    private prisma;
    constructor(prisma: PrismaService);
    getTypes(): Promise<{
        id: string;
        name: string;
        slug: string;
    }[]>;
    createType(typeDto: TypeDto): Promise<{
        id: string;
        name: string;
        slug: string;
    }>;
    getType(id: string): Promise<{
        id: string;
        name: string;
        slug: string;
    }>;
    updateType(typeDto: TypeDto, id: string): Promise<{
        id: string;
        name: string;
        slug: string;
    }>;
}
