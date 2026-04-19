import React, { useState, useEffect } from 'react';
import { Product, CreateProductDto } from '../types';
import { productAPI, uploadAPI } from '../services/api';
import { Upload, X, Plus } from 'lucide-react';

interface ProductFormProps {
  product?: Product;
  initialBarcode?: string;
  productInfo?: any;
  onSuccess: () => void;
  onCancel: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ product, initialBarcode, productInfo, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<CreateProductDto>({
    barcode: initialBarcode || '',
    name: '',
    price: undefined,
    description: '',
    quantity: undefined,
    image_url: '',
    tags: '',
    remark_images: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [remarkImages, setRemarkImages] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    if (product) {
      setFormData({
        barcode: product.barcode,
        name: product.name,
        price: product.price,
        description: product.description || '',
        quantity: product.quantity,
        image_url: product.image_url || '',
        tags: product.tags || '',
        remark_images: product.remark_images?.map(img => img.image_url) || [],
      });
      if (product.image_url) {
        setPreviewImages([product.image_url]);
      }
      if (product.tags) {
        setTags(product.tags.split(',').map(t => t.trim()).filter(t => t));
      }
      if (product.remark_images) {
        setRemarkImages(product.remark_images.map(img => img.image_url));
      }
    } else if (productInfo) {
      setFormData({
        barcode: initialBarcode || '',
        name: productInfo.name || '',
        price: productInfo.price || undefined,
        description: productInfo.description || '',
        quantity: productInfo.quantity || undefined,
        image_url: productInfo.image_url || '',
        tags: productInfo.tags || '',
        remark_images: [],
      });
      if (productInfo.image_url) {
        setPreviewImages([productInfo.image_url]);
      } else {
        setPreviewImages([]);
      }
      if (productInfo.tags) {
        setTags(productInfo.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t));
      } else {
        setTags([]);
      }
      setRemarkImages([]);
    } else if (initialBarcode) {
      setFormData(prev => ({ ...prev, barcode: initialBarcode }));
      setPreviewImages([]);
      setTags([]);
      setRemarkImages([]);
    } else {
      setFormData({
        barcode: '',
        name: '',
        price: undefined,
        description: '',
        quantity: undefined,
        image_url: '',
        tags: '',
        remark_images: [],
      });
      setPreviewImages([]);
      setTags([]);
      setRemarkImages([]);
    }
  }, [product, initialBarcode, productInfo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const submitData = {
        ...formData,
        tags: tags.join(','),
        image_url: previewImages.length > 0 ? previewImages[0] : '',
        remark_images: remarkImages,
      };
      
      if (product) {
        await productAPI.update(product.id, submitData);
      } else {
        await productAPI.create(submitData);
      }
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.error || '操作失败');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const response = await uploadAPI.uploadImage(file);
      const imageUrl = response.data.imageUrl;
      setPreviewImages([...previewImages, imageUrl]);
    } catch (err: any) {
      setError(err.response?.data?.error || '图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
  };

  const handleRemarkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setError('');

    try {
      const response = await uploadAPI.uploadImage(file);
      const imageUrl = response.data.imageUrl;
      setRemarkImages([...remarkImages, imageUrl]);
    } catch (err: any) {
      setError(err.response?.data?.error || '图片上传失败');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveRemarkImage = (index: number) => {
    const newImages = remarkImages.filter((_, i) => i !== index);
    setRemarkImages(newImages);
  };

  const handleImagePreview = (imageUrl: string) => {
    setPreviewImage(imageUrl);
  };

  const closeImagePreview = () => {
    setPreviewImage(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter(t => t !== tag));
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-6">
        {product ? '编辑商品' : '添加商品'}
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            条形码 *
          </label>
          <input
            type="text"
            value={formData.barcode}
            onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            disabled={!!product}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            商品名称 *
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
            单价
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.price ?? ''}
            onChange={(e) => setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            数量
          </label>
          <input
            type="number"
            min="0"
            value={formData.quantity ?? ''}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value ? parseInt(e.target.value) : undefined })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            备注
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            备注图片
          </label>
          {remarkImages.length > 0 ? (
            <div className="grid grid-cols-4 gap-2 mb-2">
              {remarkImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`备注图片 ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md border border-gray-300"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveRemarkImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : null}
          <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
            <input
              type="file"
              id="remark-image-upload"
              accept="image/*"
              onChange={handleRemarkImageUpload}
              className="hidden"
              disabled={uploading}
            />
            <label
              htmlFor="remark-image-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              <Upload size={32} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-600">
                {uploading ? '上传中...' : '点击上传备注图片'}
              </span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            标签
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="输入标签后按回车添加"
            />
            <button
              type="button"
              onClick={handleAddTag}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              <Plus size={20} />
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(tag)}
                  className="hover:text-blue-600"
                >
                  <X size={14} />
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            商品图片
          </label>
          {previewImages.length > 0 ? (
            <div className="grid grid-cols-4 gap-2">
              {previewImages.map((imageUrl, index) => (
                <div key={index} className="relative">
                  <img
                    src={imageUrl}
                    alt={`商品预览 ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md border border-gray-300 cursor-pointer hover:opacity-80"
                    onClick={() => handleImagePreview(imageUrl)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center">
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />
              <label
                htmlFor="image-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <Upload size={32} className="text-gray-400 mb-2" />
                <span className="text-sm text-gray-600">
                  {uploading ? '上传中...' : '点击上传图片'}
                </span>
              </label>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-4">
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

export default ProductForm;
