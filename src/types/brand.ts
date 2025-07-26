export interface IBrand {
  _id: string;
  logo?: string;
  name: string;
  description?: string;
  email?: string;
  website?: string;
  location?: string;
  status: 'active' | 'inactive';
  products?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IBrandFormData {
  logo?: string;
  name: string;
  description?: string;
  email?: string;
  website?: string;
  location?: string;
  status: 'active' | 'inactive';
}

export interface IBrandResponse {
  status: string;
  data: IBrand[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalCount: number;
    limit: number;
  };
}

export interface ISingleBrandResponse {
  status: string;
  data: IBrand;
}
