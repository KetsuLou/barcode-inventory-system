import { Response } from 'express';
import db from '../database/connection';
import { AuthRequest, CreateProductDto, UpdateProductDto } from '../types';

export const getAllProducts = (req: AuthRequest, res: Response) => {
  try {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    
    const productsWithImages = products.map((product: any) => {
      const remarkImages = db.prepare('SELECT * FROM remark_images WHERE product_id = ? ORDER BY created_at ASC').all(product.id);
      return {
        ...product,
        remark_images: remarkImages
      };
    });
    
    res.json(productsWithImages);
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

    const remarkImages = db.prepare('SELECT * FROM remark_images WHERE product_id = ? ORDER BY created_at ASC').all((product as any).id);
    
    res.json({
      ...product,
      remark_images: remarkImages
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createProduct = (req: AuthRequest, res: Response) => {
  try {
    const { barcode, name, price, description, quantity, image_url, tags, remark_images }: CreateProductDto = req.body;

    if (!barcode || !name) {
      return res.status(400).json({ error: 'Barcode and name are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO products (barcode, name, price, description, quantity, image_url, tags)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(barcode, name, price || null, description || '', quantity || 0, image_url || '', tags || '');

    const productId = result.lastInsertRowid as number;

    if (remark_images && remark_images.length > 0) {
      const imageStmt = db.prepare('INSERT INTO remark_images (product_id, image_url) VALUES (?, ?)');
      remark_images.forEach((imageUrl: string) => {
        imageStmt.run(productId, imageUrl);
      });
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(productId) as any;
    const remarkImages = db.prepare('SELECT * FROM remark_images WHERE product_id = ? ORDER BY created_at ASC').all(productId);

    res.status(201).json({
      ...product,
      remark_images: remarkImages
    });
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
    const { name, price, description, quantity, image_url, tags, remark_images }: UpdateProductDto = req.body;

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
    if (image_url !== undefined) {
      updates.push('image_url = ?');
      values.push(image_url);
    }
    if (tags !== undefined) {
      updates.push('tags = ?');
      values.push(tags);
    }

    if (updates.length === 0 && remark_images === undefined) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);

      const stmt = db.prepare(`
        UPDATE products
        SET ${updates.join(', ')}
        WHERE id = ?
      `);

      stmt.run(...values);
    }

    if (remark_images !== undefined) {
      db.prepare('DELETE FROM remark_images WHERE product_id = ?').run(id);
      
      if (remark_images.length > 0) {
        const imageStmt = db.prepare('INSERT INTO remark_images (product_id, image_url) VALUES (?, ?)');
        remark_images.forEach((imageUrl: string) => {
          imageStmt.run(id, imageUrl);
        });
      }
    }

    const product = db.prepare('SELECT * FROM products WHERE id = ?').get(id) as any;
    const remarkImages = db.prepare('SELECT * FROM remark_images WHERE product_id = ? ORDER BY created_at ASC').all(id);

    res.json({
      ...product,
      remark_images: remarkImages
    });
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
