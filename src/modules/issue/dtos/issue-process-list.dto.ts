export class IssueProcessListItemDto {
  id: string;
  documentNo: string;
  status: string;
  issueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    firstNameRu: string;
    lastNameRu: string;
    department: {
      id: string;
      name: string;
    } | null;
  };
  warehouse: {
    id: string;
    name: string;
    location: {
      id: string;
      name: string;
    } | null;
  };
  issuedBy: {
    id: string;
    firstNameRu: string;
    lastNameRu: string;
    department: {
      id: string;
      name: string;
    } | null;
  };
}
