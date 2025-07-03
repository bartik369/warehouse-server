import * as fs from 'fs';

export async function savePdfFile(
  folderPath: string,
  file: Express.Multer.File,
): Promise<string> {
  const filePath = `${folderPath}/${file.originalname}`;
  try {
    await fs.promises.mkdir(folderPath, { recursive: true });

    await fs.promises.writeFile(filePath, file.buffer);
    return file.originalname;
  } catch (error) {
    throw new Error(`Failed to process file: ${error.message}`);
  }
}
