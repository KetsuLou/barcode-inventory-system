import React, { useState, useEffect } from 'react';
import { Product } from '../types';
import { productAPI } from '../services/api';
import { Edit, Trash2, Search, X } from 'lucide-react';

interface ProductListProps {
  onEdit: (product: Product) => void;
  onRefresh: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ onEdit, onRefresh }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    loadProducts();
  }, [onRefresh]);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await productAPI.getAll();
      setProducts(response.data);
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('确定要删除这个商品吗？')) {
      return;
    }

    try {
      await productAPI.delete(id);
      loadProducts();
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('删除失败');
    }
  };

  const handleImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (product.tags && product.tags.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="搜索商品名称或条形码..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">加载中...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? '没有找到匹配的商品' : '暂无商品，点击上方按钮添加'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-semibold text-gray-700">图片</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">条形码</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">商品名称</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">单价</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">数量</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">标签</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">备注</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-700">操作</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    {product.image_url ? (
                      <img
                        src={product.image_url}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded cursor-pointer hover:opacity-80"
                        onClick={() => handleImagePreview(product.image_url!)}
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
                        无图片
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4 font-mono text-sm">{product.barcode}</td>
                  <td className="py-3 px-4 font-medium">{product.name}</td>
                  <td className="py-3 px-4">{product.price ? `¥${product.price.toFixed(2)}` : '-'}</td>
                  <td className="py-3 px-4">{product.quantity || 0}</td>
                  <td className="py-3 px-4">
                    {product.tags ? (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.split(',').map((tag, index) => (
                          <span
                            key={index}
                            className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                          >
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    ) : (
                      '-'
                    )}
                  </td>
                  <td className="py-3 px-4 text-gray-500 text-sm max-w-xs truncate">
                    {product.description || '-'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        title="编辑"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
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

      {previewImage && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={closeImagePreview}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={closeImagePreview}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <X size={32} />
            </button>
            <img
              src={previewImage}
              alt="预览"
              className="max-w-full max-h-[90vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
