import { Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import {
  PermissionExistException,
  PermissionNotFoundException,
} from 'src/exceptions/permissions.exceptions';
import { PermissionBaseDto } from './dto/permission-base.dto';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Injectable()
export class PermissionsService {
  constructor(private prisma: PrismaService) {}
  // Get all
  async getPermissions(): Promise<PermissionBaseDto[]> {
    const permissions = await this.prisma.permission.findMany({});
    if (!permissions) return null;
    return permissions;
  }
  // Get by ID
  async getPermission(id: string): Promise<PermissionBaseDto> {
    const permission = await this.prisma.permission.findUnique({
      where: { id: id },
    });
    if (!permission) throw new PermissionNotFoundException();
    return permission;
  }
  // Create
  async createPermission(
    permissionDto: CreatePermissionDto,
  ): Promise<PermissionBaseDto> {
    const existingPermission = await this.prisma.permission.findUnique({
      where: { name: permissionDto.name },
    });
    if (existingPermission) throw new PermissionExistException();
    const permission = await this.prisma.permission.create({
      data: {
        name: permissionDto.name,
        comment: permissionDto.comment,
      },
    });
    return permission;
  }
  // Update
  async updatePermission(
    id: string,
    permissionDto: UpdatePermissionDto,
  ): Promise<PermissionBaseDto> {
    const existingPermission = await this.prisma.permission.findUnique({
      where: { id: id },
    });
    if (!existingPermission) throw new PermissionNotFoundException();
    const updatedPermission = await this.prisma.permission.update({
      where: { id: id },
      data: {
        name: permissionDto.name,
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
