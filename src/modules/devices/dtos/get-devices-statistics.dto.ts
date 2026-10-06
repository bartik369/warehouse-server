export class DeviceCategoryStatisticsDto {
  id: string;
  name: string;
  slug: string;
  count: number;
}

export class DeviceStatisticsDto {
  total: number;
  assigned: number;
  inStock: number;
  nonFunctional: number;
  inRepair: number;
  byCategory: DeviceCategoryStatisticsDto[];
}
