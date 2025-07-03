export class IssueProcessBaseDto {
  id: string;
  documentNo: string;
  userId: string;
  recipientFirstName: string;
  recipientLastName: string;
  warehouseId: string;
  warehouseName: string;
  issuedById: string;
  initiatorFirstName: string;
  initiatorLastName: string;
  issueDate: Date;
  comment?: string;
  status: string;
  fileId?: string;
  fileName?: string;
  filePath?: string;
  createdAt: Date;
  updatedAt: Date;
}
