import { memoryStorage } from 'multer';
import { FileInterceptor } from '@nestjs/platform-express';
import { WrongFileSize, WrongFileType } from 'src/exceptions/device.exceptions';
import { applyDecorators, UseInterceptors } from '@nestjs/common';

interface IFileUploadOptions {
  allowedTypes?: string[];
  maxSize: number;
}
export const FileUploadInterceptor = (options: IFileUploadOptions) => {
  return applyDecorators(
    UseInterceptors(
      FileInterceptor('file', {
        storage: memoryStorage(), // Temporary file storage in memory
        limits: { fileSize: options.maxSize }, // Limit file size
        fileFilter: (req, file, callback) => {
          if (!options.allowedTypes.includes(file.mimetype)) {
            return callback(new WrongFileType(), false);
          }
          if (file.size > options.maxSize) {
            return callback(new WrongFileSize(), false);
          }
          callback(null, true);
        },
      }),
    ),
  );
};
