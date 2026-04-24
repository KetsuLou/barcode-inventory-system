import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarcodeApiConfig, CreateBarcodeApiConfigDto } from '../types';
import { barcodeApiConfigAPI } from '../services/api';
import { Plus, Edit, Trash2, Play, Settings, ArrowLeft } from 'lucide-react';

const BarcodeApiConfigPage: React.FC = () => {
  const navigate = useNavigate();
  const [configs, setConfigs] = useState<BarcodeApiConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingConfig, setEditingConfig] = useState<BarcodeApiConfig | undefined>();
  const [testingConfig, setTestingConfig] = useState<number | null>(null);
  const [testBarcode, setTestBarcode] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [testError, setTestError] = useState('');
  const [selectedConfigId, setSelectedConfigId] = useState<number | null>(null);

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      const response = await barcodeApiConfigAPI.getAll();
      setConfigs(response.data);
    } catch (error) {
      console.error('Failed to load configs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这个配置吗？')) {
      return;
    }

    try {
      await barcodeApiConfigAPI.delete(id);
      loadConfigs();
    } catch (error) {
      console.error('Failed to delete config:', error);
      alert('删除失败');
    }
  };

  const handleTest = async (id: number) => {
    if (!testBarcode.trim()) {
      alert('请输入测试条形码');
      return;
    }

    try {
      setTestingConfig(id);
      setTestResult(null);
      setTestError('');
      
      const response = await barcodeApiConfigAPI.test(id, testBarcode);
      setTestResult(response.data);
    } catch (error: any) {
      console.error('Test failed:', error);
      setTestError(error.response?.data?.error || error.message || '测试失败');
    } finally {
      setTestingConfig(null);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingConfig(undefined);
    loadConfigs();
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingConfig(undefined);
  };

  const handleEdit = (config: BarcodeApiConfig) => {
    setEditingConfig(config);
    setShowForm(true);
  };

  const handleAdd = () => {
    setEditingConfig(undefined);
    setShowForm(true);
  };

  if (showForm) {
    return (
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Settings className="text-blue-600" size={24} />
                <h1 className="text-xl font-bold text-gray-800 hidden sm:block">扫码API配置</h1>
                <h1 className="text-lg font-bold text-gray-800 sm:hidden">API配置</h1>
              </div>
              <button
                onClick={handleFormCancel}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">返回</span>
              </button>
            </div>
          </div>
        </nav>

        <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <BarcodeApiConfigForm
            config={editingConfig}
            onSuccess={handleFormSuccess}
            onCancel={handleFormCancel}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Settings className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-800 hidden sm:block">扫码API配置</h1>
              <h1 className="text-lg font-bold text-gray-800 sm:hidden">API配置</h1>
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
            >
              <ArrowLeft size={20} />
              <span className="hidden sm:inline">返回首页</span>
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <button
            onClick={handleAdd}
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus size={20} />
            添加配置
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8 text-gray-500">加载中...</div>
        ) : configs.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            暂无配置，点击上方按钮添加
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-lg p-6 overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">名称</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">URL</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">方法</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">状态</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">操作</th>
                </tr>
              </thead>
              <tbody>
                {configs.map((config) => (
                  <tr key={config.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 font-medium">{config.name}</td>
                    <td className="py-3 px-4 text-sm font-mono max-w-xs truncate">{config.url}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 bg-gray-100 rounded text-sm">
                        {config.method}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {config.enabled ? (
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
                          启用
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
                          禁用
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(config)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          title="编辑"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(config.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded"
                          title="删除"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {configs.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold mb-4">测试配置</h3>
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <select
                value={selectedConfigId || ''}
                onChange={(e) => {
                  const configId = Number(e.target.value);
                  setSelectedConfigId(configId || null);
                  setTestResult(null);
                  setTestError('');
                }}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">选择配置</option>
                {configs.filter(c => c.enabled).map((config) => (
                  <option key={config.id} value={config.id}>
                    {config.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="输入测试条形码"
                value={testBarcode}
                onChange={(e) => setTestBarcode(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {
                  if (selectedConfigId) {
                    handleTest(selectedConfigId);
                  } else {
                    alert('请选择配置');
                  }
                }}
                disabled={testingConfig !== null}
                className="flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                <Play size={20} />
                测试
              </button>
            </div>

            {testError && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
                {testError}
              </div>
            )}

            {testResult && (
              <div className="bg-gray-50 border border-gray-200 rounded p-4">
                <h4 className="font-semibold mb-2">测试结果：</h4>
                <pre className="text-sm overflow-auto max-h-96">
                  {JSON.stringify(testResult, null, 2)}
                </pre>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

interface BarcodeApiConfigFormProps {
  config?: BarcodeApiConfig;
  onSuccess: () => void;
  onCancel: () => void;
}

const BarcodeApiConfigForm: React.FC<BarcodeApiConfigFormProps> = ({ config, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateBarcodeApiConfigDto>({
    name: config?.name || '',
    url: config?.url || '',
    method: config?.method || 'GET',
    headers: config?.headers || '',
    params: config?.params || '',
    response_mapping: config?.response_mapping || '',
    enabled: config?.enabled !== undefined ? config.enabled : 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (config) {
        await barcodeApiConfigAPI.update(config.id, formData);
      } else {
        await barcodeApiConfigAPI.create(formData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {config ? '编辑配置' : '添加配置'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            配置名称 *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            API URL *
          </label>
          <input
            type="text"
            value={formData.url}
            onChange={(e) => setFormData({ ...formData, url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="https://api.example.com/goods/barcode/{{barcode}}"
          />
          <p className="text-xs text-gray-500 mt-1">
            使用 &#123;&#123;barcode&#125;&#125; 作为条形码占位符，例如：https://api.example.com/goods/barcode/&#123;&#123;barcode&#125;&#125;
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            请求方法
          </label>
          <select
            value={formData.method}
            onChange={(e) => setFormData({ ...formData, method: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            请求头 (JSON)
          </label>
          <textarea
            value={formData.headers}
            onChange={(e) => setFormData({ ...formData, headers: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder='{"Authorization": "Bearer token"}'
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            请求参数 (JSON)
          </label>
          <textarea
            value={formData.params}
            onChange={(e) => setFormData({ ...formData, params: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder='{"apiKey": "your-key"}'
          />
          <p className="text-xs text-gray-500 mt-1">
            可在参数中使用 &#123;&#123;barcode&#125;&#125; 占位符，例如：&#123;"barcode": "&#123;&#123;barcode&#125;&#125;", "apiKey": "your-key"&#125;
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            响应映射 (JSON)
          </label>
          <textarea
            value={formData.response_mapping}
            onChange={(e) => setFormData({ ...formData, response_mapping: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
            placeholder='{"name": "data.productName", "price": "data.price"}'
          />
          <p className="text-xs text-gray-500 mt-1">
            将API响应映射到商品字段，支持嵌套路径。可用字段：name, price, description, quantity, image_url, tags
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            id="enabled"
            checked={formData.enabled === 1}
            onChange={(e) => setFormData({ ...formData, enabled: e.target.checked ? 1 : 0 })}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
          />
          <label htmlFor="enabled" className="text-sm font-medium text-gray-700">
            启用此配置
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? '保存中...' : '保存'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
          >
            取消
          </button>
        </div>
      </form>
    </div>
  );
};

export default BarcodeApiConfigPage;