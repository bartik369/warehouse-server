import { ContractorDto } from './dtos/contactor.dto';
import { ContractorsService } from './contractors.service';
export declare class ContractorsController {
    private contractorsService;
    constructor(contractorsService: ContractorsService);
    getContractors(): Promise<ContractorDto[]>;
    createContractor(contractorDto: ContractorDto): Promise<{
        message: string;
        contractor: ContractorDto;
    }>;
    getContractor(id: string): Promise<ContractorDto>;
    updateContractor(id: string, contractorDto: ContractorDto): Promise<{
        message: string;
        updatedContractor: ContractorDto;
    }>;
}
