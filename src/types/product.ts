export type Product = {
  image: string;
  name: string;
  category: string;
  price: number;
  sold: number;
  profit: number;
};

export interface IImageURL {
  color: {
    name?: string;
    clrCode?: string;
  };
  img?: string;
  sizes: string[];
}

export interface IBrand {
  name: string;
  id: string;
}

export interface ICategory {
  name: string;
  id: string;
}

export interface IOfferDate {
  startDate?: Date;
  endDate?: Date;
}

export interface IProduct {
  _id?: string;
  sku?: string;
  img: string;
  title: string;
  slug?: string;
  unit: string;
  imageURLs: IImageURL[];
  parent: string;
  children: string;
  price: number;
  discount?: number;
  quantity: number;
  brand: IBrand;
  category: ICategory;
  categories: string; // ObjectId reference
  subCategories: string; // ObjectId reference
  subCategoriesItemName?: string;
  status: 'in-stock' | 'out-of-stock' | 'discontinued';
  reviews?: string[]; // ObjectId references
  productType: string;
  description: string;
  videoId?: string;
  additionalInformation?: Record<string, any>[];
  tags?: string[];
  sizes?: string[];
  offerDate?: IOfferDate;
  featured?: boolean;
  sellCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IProductFormData {
  sku?: string;
  img: string;
  title: string;
  slug?: string;
  unit: string;
  parent: string;
  children: string;
  price: number;
  discount?: number;
  quantity: number;
  brandName: string;
  brandId: string;
  categoryName: string;
  categoryId: string;
  categories: string;
  subCategories: string;
  subCategoriesItemName?: string;
  status: 'in-stock' | 'out-of-stock' | 'discontinued';
  productType: string;
  description: string;
  videoId?: string;
  tags?: string[];
  sizes?: string[];
  featured?: boolean;
}
