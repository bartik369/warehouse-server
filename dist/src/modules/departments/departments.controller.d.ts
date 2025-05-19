import { DepartmentsService } from './departments.service';
import { DepartmentDto } from '../departments/dtos/department.dto';
export declare class DepartmentsController {
    private departmentsService;
    constructor(departmentsService: DepartmentsService);
    getDepartments(): Promise<DepartmentDto[]>;
    getDepartment(id: string): Promise<DepartmentDto>;
    createDepartment(departmentDto: DepartmentDto): Promise<{
        message: string;
        department: DepartmentDto;
    }>;
    updateDepartment(departmentDto: DepartmentDto, id: string): Promise<{
        message: string;
        updatedDepartment: DepartmentDto;
    }>;
}
