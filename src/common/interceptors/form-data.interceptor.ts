import { applyDecorators, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

export const FormDataOnlyInterceptor = () => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: memoryStorage(),
        fileFilter: (_, __, cb) => cb(null, true),
      }),
    ),
  );
};
