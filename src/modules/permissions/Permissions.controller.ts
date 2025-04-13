import { Controller } from '@nestjs/common';
import { PermissionsService } from './Permissions.service';

@Controller()
export class PermissionsController {
  constructor(private permissionsService: PermissionsService) {}
}
