export interface DeviceHistoryItem {
  id: string;
  type: 'ISSUE' | 'RETURN' | 'TRANSFER';
  date: Date;
  processId: string | null;
  documentNo: string | null;
  status: string | null;
  user?: {
    id: string;
    userName: string;
    firstNameEn: string;
    lastNameEn: string;
    firstNameRu: string;
    lastNameRu: string;
  } | null;
  performedBy: {
    id: string;
    userName: string;
    firstNameEn: string;
    lastNameEn: string;
    firstNameRu: string;
    lastNameRu: string;
  } | null;
  warehouse?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  fromWarehouse?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  toWarehouse?: {
    id: string;
    name: string;
    slug: string;
  } | null;
  comment: string | null;
  condition?: string | null;
}
