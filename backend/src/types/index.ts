import { Request } from 'express';

export interface User {
  id: number;
  username: string;
  password: string;
  tenant_id: number;
  created_at: string;
}

export interface AuthRequest extends Request {
  userId?: number;
  tenantId?: number;
}

export interface Product {
  id: number;
  barcode: string;
  name: string;
  price: number;
  description?: string;
  quantity: number;
  image_url?: string;
  tags?: string;
  tenant_id: number;
  created_at: string;
  updated_at: string;
  remark_images?: RemarkImage[];
}

export interface RemarkImage {
  id: number;
  product_id: number;
  image_url: string;
  tenant_id: number;
  created_at: string;
}

export interface CreateProductDto {
  barcode: string;
  name: string;
  price?: number;
  description?: string;
  quantity?: number;
  image_url?: string;
  tags?: string;
  remark_images?: string[];
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  description?: string;
  quantity?: number;
  image_url?: string;
  tags?: string;
  remark_images?: string[];
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
    tenant_id: number;
  };
}

export interface BarcodeApiConfig {
  id: number;
  name: string;
  url: string;
  method: string;
  headers?: string;
  params?: string;
  response_mapping?: string;
  enabled: number;
  tenant_id: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBarcodeApiConfigDto {
  name: string;
  url: string;
  method?: string;
  headers?: string;
  params?: string;
  response_mapping?: string;
  enabled?: number;
}

export interface UpdateBarcodeApiConfigDto {
  name?: string;
  url?: string;
  method?: string;
  headers?: string;
  params?: string;
  response_mapping?: string;
  enabled?: number;
}

export interface CreateUserDto {
  username: string;
  password: string;
}

export interface UpdatePasswordDto {
  oldPassword: string;
  newPassword: string;
}
