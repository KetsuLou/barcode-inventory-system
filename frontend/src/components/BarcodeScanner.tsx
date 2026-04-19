import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X, Loader2 } from 'lucide-react';
import { barcodeApiConfigAPI } from '../services/api';

interface BarcodeScannerProps {
  onScan: (barcode: string, productInfo?: any) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState<string>('');

  const handleScan = async (decodedText: string) => {
    setScannedBarcode(decodedText);
    setLoading(true);
    setError('');

    try {
      const response = await barcodeApiConfigAPI.getEnabled();
      if (response.data) {
        const testResponse = await barcodeApiConfigAPI.test(response.data.id, decodedText);
        if (testResponse.data.success) {
          onScan(decodedText, testResponse.data.data);
          onClose();
          return;
        }
      }
    } catch (err) {
      console.error('Failed to fetch product info:', err);
    }

    onScan(decodedText);
    onClose();
  };

  useEffect(() => {
    const scanner = new Html5Qrcode('reader');
    scannerRef.current = scanner;

    const config = {
      fps: 10,
      qrbox: { width: 250, height: 250 },
    };

    scanner.start(
      { facingMode: 'environment' },
      config,
      (decodedText) => {
        handleScan(decodedText);
      },
      () => {
      }
    ).catch((err) => {
      setError('无法启动摄像头，请确保已授予摄像头权限');
      console.error('Scanner error:', err);
    });

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScan, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">扫描条形码</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <X size={24} />
          </button>
        </div>
        
        {error ? (
          <div className="text-red-500 text-center py-8">{error}</div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <Loader2 className="animate-spin text-blue-600 mb-2" size={32} />
            <p className="text-sm text-gray-600">正在获取商品信息...</p>
            {scannedBarcode && (
              <p className="text-xs text-gray-500 mt-1">条形码: {scannedBarcode}</p>
            )}
          </div>
        ) : (
          <div id="reader" className="w-full"></div>
        )}
        
        <p className="text-sm text-gray-500 mt-4 text-center">
          将条形码或二维码对准摄像头
        </p>
      </div>
    </div>
  );
};

export default BarcodeScanner;
