export interface IUser {
  id: number;
  email: string;
  name: string;
  role: string;
  avatar?: string | null;
}

export interface IMedia {
  id: number;
  documentId?: string;
  url: string;
  name?: string;
}

export interface ICategory {
  id: number;
  documentId?: string;
  name: string;
  slug: string;
  description?: string;
  position: number;
  articlesCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface IArticle {
  id: number;
  documentId?: string;
  title: string;
  slug: string;
  description?: string;
  content?: string;
  position?: number;
  cover?: IMedia | null;
  category?: ICategory | null;
  author?: {
    id: number;
    name: string;
    email: string;
    avatar?: IMedia | null;
  } | null;
  createdAt: string;
  updatedAt?: string;
}

export interface IBanner {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  thumbnail?: IMedia | null;
  position: number;
  button?: {
    id?: number;
    title: string;
    url: string;
    icon?: IMedia | string | null;
  }[];
  createdAt?: string;
}

export interface IProgram {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  position: number;
  icon?: IMedia | null;
  createdAt?: string;
}

export interface IExtracurricular {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  position: number;
  locale?: string;
  icon?: IMedia | null;
  createdAt?: string;
}

export interface IFacility {
  id: number;
  documentId?: string;
  title: string;
  position: number;
  image?: IMedia | null;
  icon?: IMedia | null;
  createdAt?: string;
}

export interface IAchievement {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  position: number;
  icon?: IMedia | null;
  createdAt?: string;
}

export interface IGalleryActivity {
  id: number;
  documentId?: string;
  title: string;
  description?: string;
  position: number;
  thumbnail?: IMedia | null;
  gallery?: IMedia[];
  createdAt?: string;
}

export interface IFAQ {
  id: number;
  documentId?: string;
  question: string;
  answer: string;
  category?: string;
  order?: number;
}
