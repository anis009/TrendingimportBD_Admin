export interface IItem {
  _id?: string;
  name: string;
  image?: string;
  order?: number;
}

export interface ISubCategory {
  _id: string;
  image?: string;
  title: string;
  slug: string;
  user: string;
  categories: string; // Required field that references Categories model
  order?: number;
  items?: IItem[];
  createdAt?: string;
  updatedAt?: string;
}
