import { Response } from 'express';
import db from '../database/connection';
import { AuthRequest, CreateProductDto, UpdateProductDto } from '../types';

export const getAllProducts = (req: AuthRequest, res: Response) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    res.json(products);
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getProductByBarcode = (req: AuthRequest, res: Response) => {
  try {
    const { barcode } = req.params;
    const product = db.prepare('SELECT * FROM products WHERE barcode = ?').get(barcode);

    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = (req: AuthRequest, res: Response) => {
  try {
    const { barcode, name, price, description, quantity }: CreateProductDto = req.body;

    if (!barcode || !name || !price) {
      return res.status(400).json({ error: 'Barcode, name, and price are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO products (barcode, name, price, description, quantity)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = stmt.run(barcode, name, price, description || '', quantity || 0);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(product);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Product with this barcode already exists' });
    }
    console.error('Create product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduct = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, price, description, quantity }: UpdateProductDto = req.body;

    const existingProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (price !== undefined) {
      updates.push('price = ?');
      values.push(price);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (quantity !== undefined) {
      updates.push('quantity = ?');
      values.push(quantity);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE products
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    res.json(product);
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteProduct = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    db.prepare('DELETE FROM products WHERE id = ?').run(id);

    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
