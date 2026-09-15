export class ModelBaseDto {
  id: string;
  name: string;
  slug: string;
  imagePath?: string;
  typeId: string;
  manufacturerId: string;
}

export class DeviceModelResponseDto extends ModelBaseDto {
  manufacturer: {
    id: string;
    name: string;
    slug: string;
    comment?: string;
  };

  type: {
    id: string;
    name: string;
    slug: string;
  };
}
