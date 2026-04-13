export interface User {
  id: number;
  username: string;
  password: string;
  created_at: string;
}

export interface Product {
  id: number;
  barcode: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  image_url?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductDto {
  barcode: string;
  name: string;
  price: number;
  description?: string;
  quantity?: number;
  image_url?: string;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  description?: string;
  quantity?: number;
  image_url?: string;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    username: string;
  };
}
