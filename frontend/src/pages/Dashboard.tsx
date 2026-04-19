import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import BarcodeScanner from '../components/BarcodeScanner';
import { Plus, Scan, LogOut, Package, Settings } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [scannerKey, setScannerKey] = useState(0);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
    setScannedBarcode('');
    setShowForm(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    setEditingProduct(undefined);
    setRefreshKey((prev) => prev + 1);
  };

  const handleFormCancel = () => {
    setShowForm(false);
    setEditingProduct(undefined);
    setScannedBarcode('');
  };

  const handleScan = useCallback((barcode: string, productInfo?: any) => {
    setShowScanner(false);
    setEditingProduct(undefined);
    setScannedBarcode(barcode);
    setShowForm(true);
    
    if (productInfo) {
      setEditingProduct({
        id: 0,
        barcode,
        name: productInfo.name || '',
        price: productInfo.price || 0,
        description: productInfo.description || '',
        quantity: productInfo.quantity || 0,
        image_url: productInfo.image_url || '',
        tags: productInfo.tags || '',
        created_at: '',
        updated_at: '',
      });
    }
  }, []);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">加载中...</div>;
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <Package className="text-blue-600" size={24} />
              <h1 className="text-xl font-bold text-gray-800">商品库存管理</h1>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/config')}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
                title="扫码API配置"
              >
                <Settings size={20} />
              </button>
              <span className="text-gray-600">欢迎, {user?.username}</span>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-gray-800"
              >
                <LogOut size={20} />
                退出
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-4 mb-6">
          <button
            onClick={handleAddProduct}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            <Plus size={20} />
            添加商品
          </button>
          <button
            onClick={() => {
              setScannerKey(prev => prev + 1);
              setShowScanner(true);
            }}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
          >
            <Scan size={20} />
            扫描商品
          </button>
        </div>

        {showForm && (
          <div className="mb-6">
            <ProductForm
              product={editingProduct}
              initialBarcode={scannedBarcode}
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        <ProductList
          onEdit={handleEditProduct}
          onRefresh={() => refreshKey}
        />
      </main>

      {showScanner && (
        <BarcodeScanner
          key={scannerKey}
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
