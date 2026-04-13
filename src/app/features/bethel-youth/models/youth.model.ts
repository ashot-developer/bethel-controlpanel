export interface Youth {
  id: number;
  fullName: string;
  phoneNumber: string;
  bdate: Date;
  familyStatus: string;
  avatar: string;
  additionalInfo: string;
  createdAt: Date;
  documentId: string;
  publishedAt: Date;
  updatedAt: Date;
}

export interface YouthUI extends Youth {
  age: number;
}

export interface YouthResponse {
  data: Youth[];
  meta: {
    pagination: Pagination;
  }
}

export interface Pagination {
  start: number;
  limit: number;
  total: number;
}