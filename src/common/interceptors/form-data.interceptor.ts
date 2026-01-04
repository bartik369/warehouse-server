import { memoryStorage } from 'multer';

import { UseInterceptors, applyDecorators } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

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
