import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/connection';
import { LoginDto, AuthResponse, CreateUserDto, UpdatePasswordDto, AuthRequest, UpdateUserDto } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';

export const login = (req: Request, res: Response) => {
  try {
    const { username, password }: LoginDto = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    const user = db.prepare('SELECT * FROM users WHERE username = ?').get(username) as any;

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user.id, tenantId: user.tenant_id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    const response: AuthResponse = {
      token,
      user: {
        id: user.id,
        username: user.username,
        tenant_id: user.tenant_id,
        role: user.role
      }
    };

    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const register = (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare('INSERT INTO users (username, password, tenant_id, role) VALUES (?, ?, ?, ?)');
    const result = stmt.run(username, hashedPassword, 1, 'user');

    const token = jwt.sign({ userId: result.lastInsertRowid, tenantId: 1, role: 'user' }, JWT_SECRET, { expiresIn: '24h' });

    const response: AuthResponse = {
      token,
      user: {
        id: result.lastInsertRowid as number,
        username,
        tenant_id: 1,
        role: 'user'
      }
    };

    res.status(201).json(response);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUsers = (req: AuthRequest, res: Response) => {
  try {
    const users = db.prepare('SELECT id, username, tenant_id, role, created_at FROM users WHERE tenant_id = ?').all(req.tenantId);
    res.json(users);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createUser = (req: AuthRequest, res: Response) => {
  try {
    const { username, password }: CreateUserDto = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const hashedPassword = bcrypt.hashSync(password, 10);

    const stmt = db.prepare('INSERT INTO users (username, password, tenant_id, role) VALUES (?, ?, ?, ?)');
    const result = stmt.run(username, hashedPassword, req.tenantId, 'user');

    const user = db.prepare('SELECT id, username, tenant_id, role, created_at FROM users WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(user);
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return res.status(409).json({ error: 'Username already exists' });
    }
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteUser = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.tenant_id !== req.tenantId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (user.id === req.userId) {
      return res.status(400).json({ error: 'Cannot delete yourself' });
    }

    db.prepare('DELETE FROM users WHERE id = ?').run(id);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updatePassword = (req: AuthRequest, res: Response) => {
  try {
    const { oldPassword, newPassword }: UpdatePasswordDto = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({ error: 'Old password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(req.userId) as any;

    if (!user || !bcrypt.compareSync(oldPassword, user.password)) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, req.userId);

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateUser = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { tenant_id, password }: UpdateUserDto = req.body;

    if (req.role !== 'admin') {
      return res.status(403).json({ error: 'Only admin can update users' });
    }

    const user = db.prepare('SELECT * FROM users WHERE id = ?').get(id) as any;
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (user.role === 'admin' && user.id !== req.userId) {
      return res.status(403).json({ error: 'Cannot update other admin' });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (tenant_id !== undefined) {
      updates.push('tenant_id = ?');
      values.push(tenant_id);
    }

    if (password !== undefined) {
      if (password.length < 6) {
        return res.status(400).json({ error: 'Password must be at least 6 characters' });
      }
      const hashedPassword = bcrypt.hashSync(password, 10);
      updates.push('password = ?');
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    values.push(id);

    const stmt = db.prepare(`
      UPDATE users
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);

    const updatedUser = db.prepare('SELECT id, username, tenant_id, role, created_at FROM users WHERE id = ?').get(id);

    res.json(updatedUser);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
