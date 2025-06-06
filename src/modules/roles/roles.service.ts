import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  RoleExistException,
  RoleNotFoundException,
} from 'src/exceptions/permissions.exceptions';
import { RoleBaseDto } from './dto/role-base.dto';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}
  // Get all
  async getRoles(): Promise<RoleBaseDto[]> {
    const roles = await this.prisma.role.findMany({});
    if (!roles) throw new RoleNotFoundException();
    return roles;
  }
  // Get by ID
  async getRole(id: string): Promise<RoleBaseDto> {
    const role = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!role) throw new RoleNotFoundException();
    return role;
  }
  // Get all for Assign
  async getAssignableRoles(): Promise<RoleBaseDto[]> {
    const roles = await this.prisma.role.findMany({
      where: {
        name: { not: 'administrator' },
      },
    });
    return roles;
  }
  // Create
  async createRole(roleDto: CreateRoleDto): Promise<RoleBaseDto> {
    const existingRole = await this.prisma.role.findUnique({
      where: { name: roleDto.name?.trim() },
    });
    if (existingRole) throw new RoleExistException();
    const role = await this.prisma.role.create({
      data: {
        name: roleDto.name,
        comment: roleDto.comment,
      },
    });
    return role;
  }
  // Update
  async updateRole(id: string, roleDto: UpdateRoleDto): Promise<RoleBaseDto> {
    const existingRole = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!existingRole) throw new RoleNotFoundException();
    const updatedRole = await this.prisma.role.update({
      where: { id: id },
      data: {
        name: roleDto.name,
        comment: roleDto.comment,
      },
    });
    return updatedRole;
  }
  // Delete
  async deleteRole(id: string) {
    const role = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!role) throw new RoleNotFoundException();
    await this.prisma.role.delete({
      where: { id: id },
    });
  }
}
