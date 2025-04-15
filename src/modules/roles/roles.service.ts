import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { RoleDto } from './dto/role.dto';
import {
  RoleExistException,
  RoleNotFoundException,
} from 'src/exceptions/permissions.exceptions';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}
  // Get all
  async getRoles() {
    const roles = await this.prisma.role.findMany({});
    if (!roles) return null;
    return roles;
  }
  // Get by ID
  async getRole(id: string): Promise<RoleDto> {
    const role = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!role) throw new RoleNotFoundException();
    return role;
  }
  // Create
  async createRole(roleDto: RoleDto) {
    const existingRole = await this.prisma.role.findUnique({
      where: { name: roleDto.name?.trim() },
    });
    if (existingRole) throw new RoleExistException();
    const role = await this.prisma.role.create({
      data: {
        name: roleDto.name?.trim(),
        comment: roleDto.comment,
      },
    });
    return role;
  }
  // Update
  async updateRole(id: string, roleDto: RoleDto): Promise<RoleDto> {
    const existingRole = await this.prisma.role.findUnique({
      where: { id: id },
    });
    if (!existingRole) throw new RoleNotFoundException();
    const updatedRole = await this.prisma.role.update({
      where: { id: id },
      data: {
        name: roleDto.name?.trim(),
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
