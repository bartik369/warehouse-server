import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  PermissionExistException,
  PermissionNotFoundException,
} from 'src/exceptions/permissions.exceptions';
import { PermissionDto } from './dto/permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}
  // Get all
  async getPermissions() {
    const permissions = await this.prisma.permission.findMany({});
    if (!permissions) return null;
    return permissions;
  }
  // Get by ID
  async getPermission(id: string): Promise<PermissionDto> {
    const permission = await this.prisma.permission.findUnique({
      where: { id: id },
    });
    if (!permission) throw new PermissionNotFoundException();
    return permission;
  }
  // Create
  async createPermission(permissionDto: PermissionDto): Promise<PermissionDto> {
    const existingPermission = await this.prisma.permission.findUnique({
      where: { name: permissionDto.name?.trim() },
    });
    if (existingPermission) throw new PermissionExistException();
    const permission = await this.prisma.permission.create({
      data: {
        name: permissionDto.name?.trim(),
        comment: permissionDto.comment,
      },
    });
    return permission;
  }
  // Update
  async updatePermission(
    id: string,
    permissionDto: PermissionDto,
  ): Promise<PermissionDto> {
    const existingPermission = await this.prisma.permission.findUnique({
      where: { id: id },
    });
    if (!existingPermission) throw new PermissionNotFoundException();
    const updatedPermission = await this.prisma.permission.update({
      where: { id: id },
      data: {
        name: permissionDto.name?.trim(),
        comment: permissionDto.comment || undefined,
      },
    });
    return updatedPermission;
  }
  // Delete
  async deletePermission(id: string) {
    const permission = await this.prisma.permission.findUnique({
      where: { id: id },
    });
    if (!permission) throw new PermissionNotFoundException();
    await this.prisma.permission.delete({
      where: { id: id },
    });
  }
}
