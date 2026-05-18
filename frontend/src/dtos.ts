export type Id = string;

export interface AdDto {
  id: Id;
  title: string;
  category: string;
  body: string;
  author: string;
  createdAt: string;
}

export interface CreateAdDto {
  title: string;
  category: string;
  body: string;
  author: string;
}

export interface ApiError {
  status: number;
  message: string;
  details?: string;
  errors?: Record<string, string[]>;
}