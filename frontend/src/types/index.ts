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
  created_at: string;
  updated_at: string;
}

export interface CreateProductDto {
  barcode: string;
  name: string;
  price: number;
  description?: string;
  quantity?: number;
}

export interface UpdateProductDto {
  name?: string;
  price?: number;
  description?: string;
  quantity?: number;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}
