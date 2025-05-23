import { PrismaService } from 'prisma/prisma.service';
import { DepartmentDto } from './dtos/department.dto';
export declare class DepartmentsService {
    private prisma;
    constructor(prisma: PrismaService);
    getDepartments(): Promise<DepartmentDto[]>;
    getDepartment(id: string): Promise<DepartmentDto>;
    createDepartment(departmentDto: DepartmentDto): Promise<DepartmentDto>;
    updateDepartment(id: string, departmentDto: DepartmentDto): Promise<DepartmentDto>;
}
