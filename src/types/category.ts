export interface ICategory {
  _id: string;
  image?: string;
  title: string;
  slug: string;
  user: string;
  order?: number;
  createdAt?: string;
  updatedAt?: string;
}
