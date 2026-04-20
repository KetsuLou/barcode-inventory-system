import { Response } from 'express';
import db from '../database/connection';
import { AuthRequest, CreateBarcodeApiConfigDto, UpdateBarcodeApiConfigDto } from '../types';

export const getAllConfigs = (req: AuthRequest, res: Response) => {
  try {
    const configs = db.prepare('SELECT * FROM barcode_api_config WHERE tenant_id = ? ORDER BY created_at DESC').all(req.tenantId);
    res.json(configs);
  } catch (error) {
    console.error('Get configs error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getEnabledConfig = (req: AuthRequest, res: Response) => {
  try {
    const config = db.prepare('SELECT * FROM barcode_api_config WHERE enabled = 1 AND tenant_id = ? LIMIT 1').get(req.tenantId);
    if (!config) {
      return res.status(404).json({ error: 'No enabled config found' });
    }
    res.json(config);
  } catch (error) {
    console.error('Get enabled config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getConfigById = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const config = db.prepare('SELECT * FROM barcode_api_config WHERE id = ? AND tenant_id = ?').get(id, req.tenantId);

    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    res.json(config);
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const createConfig = (req: AuthRequest, res: Response) => {
  try {
    const { name, url, method, headers, params, response_mapping, enabled }: CreateBarcodeApiConfigDto = req.body;

    if (!name || !url) {
      return res.status(400).json({ error: 'Name and url are required' });
    }

    const stmt = db.prepare(`
      INSERT INTO barcode_api_config (name, url, method, headers, params, response_mapping, enabled, tenant_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = stmt.run(
      name,
      url,
      method || 'GET',
      headers || '',
      params || '',
      response_mapping || '',
      enabled !== undefined ? (enabled ? 1 : 0) : 1,
      req.tenantId
    );

    const config = db.prepare('SELECT * FROM barcode_api_config WHERE id = ?').get(result.lastInsertRowid);

    res.status(201).json(config);
  } catch (error: any) {
    console.error('Create config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateConfig = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { name, url, method, headers, params, response_mapping, enabled }: UpdateBarcodeApiConfigDto = req.body;

    const existingConfig = db.prepare('SELECT * FROM barcode_api_config WHERE id = ? AND tenant_id = ?').get(id, req.tenantId);
    if (!existingConfig) {
      return res.status(404).json({ error: 'Config not found' });
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push('name = ?');
      values.push(name);
    }
    if (url !== undefined) {
      updates.push('url = ?');
      values.push(url);
    }
    if (method !== undefined) {
      updates.push('method = ?');
      values.push(method);
    }
    if (headers !== undefined) {
      updates.push('headers = ?');
      values.push(headers);
    }
    if (params !== undefined) {
      updates.push('params = ?');
      values.push(params);
    }
    if (response_mapping !== undefined) {
      updates.push('response_mapping = ?');
      values.push(response_mapping);
    }
    if (enabled !== undefined) {
      updates.push('enabled = ?');
      values.push(enabled ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const stmt = db.prepare(`
      UPDATE barcode_api_config
      SET ${updates.join(', ')}
      WHERE id = ?
    `);

    stmt.run(...values);

    const config = db.prepare('SELECT * FROM barcode_api_config WHERE id = ?').get(id);
    res.json(config);
  } catch (error) {
    console.error('Update config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteConfig = (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const existingConfig = db.prepare('SELECT * FROM barcode_api_config WHERE id = ? AND tenant_id = ?').get(id, req.tenantId);
    if (!existingConfig) {
      return res.status(404).json({ error: 'Config not found' });
    }

    db.prepare('DELETE FROM barcode_api_config WHERE id = ?').run(id);

    res.json({ message: 'Config deleted successfully' });
  } catch (error) {
    console.error('Delete config error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const testConfig = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { barcode } = req.body;

    if (!barcode) {
      return res.status(400).json({ error: 'Barcode is required' });
    }

    const config = db.prepare('SELECT * FROM barcode_api_config WHERE id = ?').get(id) as any;
    if (!config) {
      return res.status(404).json({ error: 'Config not found' });
    }

    const axios = require('axios');
    
    const headers = config.headers ? JSON.parse(config.headers) : {};
    let url = config.url;
    let data = undefined;

    if (url.includes('{barcode}')) {
      url = url.replace('{barcode}', barcode);
      
      if (config.method === 'GET') {
        const params = config.params ? JSON.parse(config.params) : {};
        if (Object.keys(params).length > 0) {
          url = `${url}?${new URLSearchParams(params).toString()}`;
        }
      } else {
        const params = config.params ? JSON.parse(config.params) : {};
        data = params;
      }
    } else {
      if (config.method === 'GET') {
        const params = config.params ? JSON.parse(config.params) : {};
        const queryParams = { ...params, barcode };
        url = `${url}?${new URLSearchParams(queryParams).toString()}`;
      } else {
        const params = config.params ? JSON.parse(config.params) : {};
        data = { ...params, barcode };
      }
    }

    const response = await axios({
      method: config.method,
      url,
      headers,
      data,
      timeout: 10000,
    });

    let result = response.data;
    
    if (config.response_mapping) {
      try {
        const mapping = JSON.parse(config.response_mapping);
        result = {};
        for (const [key, path] of Object.entries(mapping)) {
          const keys = (path as string).split('.');
          let value = response.data;
          for (const k of keys) {
            value = value?.[k];
          }
          result[key] = value;
        }
      } catch (error) {
        console.error('Parse response mapping error:', error);
      }
    }

    res.json({
      success: true,
      data: result,
      raw: response.data,
    });
  } catch (error: any) {
    console.error('Test config error:', error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};