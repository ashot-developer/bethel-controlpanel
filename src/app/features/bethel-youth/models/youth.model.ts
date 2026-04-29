export interface Youth {
  id?: number;
  fullName: string;
  phoneNumber: string;
  bdate: Date;
  familyStatus: string;
  avatar?: number | Avatar;
  additionalInfo: string;
  createdAt?: Date;
  documentId?: string;
  publishedAt?: Date;
  updatedAt?: Date;
}

export interface Avatar {
  id: number;
  url?: string
}

export interface YouthUI extends Youth {
  age?: number;
  avatarData?: { 
    id: number;
    url?: string;
  };
  avatarUrl?: string;
}

export interface YouthResponse {
  data: Youth[];
  meta: {
    pagination: Pagination;
  }
}

export interface YouthSingleResponse {
  data: Youth;
}

export interface Pagination {
  start: number;
  limit: number;
  total: number;
}