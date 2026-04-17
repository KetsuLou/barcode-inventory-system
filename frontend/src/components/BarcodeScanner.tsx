import React, { useEffect, useRef, useState } from 'react';
import { Html5Qrcode } from 'html5-qrcode';
import { X } from 'lucide-react';

interface BarcodeScannerProps {
  onScan: (barcode: string) => void;
  onClose: () => void;
}

const BarcodeScanner: React.FC<BarcodeScannerProps> = ({ onScan, onClose }) => {
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [error, setError] = useState<string>('');

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
        onScan(decodedText);
        scanner.stop();
      },
      () => {
        // Ignore scanning errors
      }
    ).catch((err) => {
      setError('无法启动摄像头，请确保已授予摄像头权限');
      console.error('Scanner error:', err);
    });

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [onScan]);

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
