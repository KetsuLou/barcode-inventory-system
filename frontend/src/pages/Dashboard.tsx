import React, { useState, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Product } from '../types';
import ProductList from '../components/ProductList';
import ProductForm from '../components/ProductForm';
import BarcodeScanner from '../components/BarcodeScanner';
import { Plus, Scan, LogOut, Package } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | undefined>();
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleAddProduct = () => {
    setEditingProduct(undefined);
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
  };

  const handleScan = useCallback((barcode: string) => {
    setShowScanner(false);
    setEditingProduct(undefined);
    setShowForm(true);
    setTimeout(() => {
      const barcodeInput = document.querySelector('input[type="text"]') as HTMLInputElement;
      if (barcodeInput) {
        barcodeInput.value = barcode;
        barcodeInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }, 100);
  }, []);

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
            onClick={() => setShowScanner(true)}
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
          onScan={handleScan}
          onClose={() => setShowScanner(false)}
        />
      )}
    </div>
  );
};

export default Dashboard;
