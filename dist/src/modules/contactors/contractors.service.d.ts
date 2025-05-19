import { PrismaService } from 'prisma/prisma.service';
import { ContractorDto } from './dtos/contactor.dto';
export declare class ContractorsService {
    private prisma;
    constructor(prisma: PrismaService);
    getContractors(): Promise<ContractorDto[]>;
    createContractor(contractorDto: ContractorDto): Promise<ContractorDto>;
    getContractor(id: string): Promise<ContractorDto>;
    updateContractor(id: string, contractorDto: ContractorDto): Promise<ContractorDto>;
}
