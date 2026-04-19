export interface User {
  id: number;
  username: string;
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
  created_at: string;
  updated_at: string;
  remark_images?: RemarkImage[];
}

export interface RemarkImage {
  id: number;
  product_id: number;
  image_url: string;
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

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
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
