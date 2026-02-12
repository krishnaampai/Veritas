import { useState } from 'react';
import { ArrowLeft, CheckCircle, XCircle, Scan, Upload } from 'lucide-react';
import { useNavigate } from 'react-router';

export function CustomerPage() {
  const navigate = useNavigate();
  const [verificationResult, setVerificationResult] = useState<'genuine' | 'counterfeit' | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleVerify = () => {
    setIsScanning(true);
    setVerificationResult(null);
    
    // Simulate verification process
    setTimeout(() => {
      setIsScanning(false);
      // Random result for demo purposes
      const isGenuine = Math.random() > 0.3;
      setVerificationResult(isGenuine ? 'genuine' : 'counterfeit');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="p-6 flex items-center gap-4 border-b border-slate-700/50">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div className="flex items-center gap-3">
          <Scan className="size-8 text-cyan-400" />
          <h1 className="text-3xl font-bold">VERITAS</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-2xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Verify Product Authenticity</h2>
          <p className="text-slate-300 text-lg">
            Scan or upload a QR code to verify if your product is genuine
          </p>
        </div>

        {/* QR Code Scan Section */}
        <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 mb-8">
          <div className="flex flex-col items-center gap-6">
            {/* QR Code Placeholder */}
            <div className="w-64 h-64 bg-slate-900 border-2 border-dashed border-slate-600 rounded-xl flex items-center justify-center relative overflow-hidden group">
              {isScanning ? (
                <div className="absolute inset-0 bg-cyan-500/20 animate-pulse"></div>
              ) : null}
              <div className="text-center z-10">
                <Scan className="size-16 text-slate-600 mx-auto mb-4" />
                <p className="text-slate-500 text-sm">
                  {isScanning ? 'Scanning...' : 'QR Code Scan Area'}
                </p>
              </div>
            </div>

            {/* Upload Option */}
            <button className="flex items-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors">
              <Upload className="size-5" />
              <span>Upload QR Code Image</span>
            </button>
          </div>
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isScanning}
          className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-cyan-500/50 mb-8"
        >
          {isScanning ? 'Verifying...' : 'Verify Product'}
        </button>

        {/* Result Area */}
        {verificationResult && (
          <div
            className={`p-8 rounded-2xl border-2 ${
              verificationResult === 'genuine'
                ? 'bg-green-500/10 border-green-500'
                : 'bg-red-500/10 border-red-500'
            } animate-in fade-in slide-in-from-bottom-4 duration-500`}
          >
            <div className="flex items-center gap-4 mb-4">
              {verificationResult === 'genuine' ? (
                <CheckCircle className="size-12 text-green-500" strokeWidth={2} />
              ) : (
                <XCircle className="size-12 text-red-500" strokeWidth={2} />
              )}
              <div>
                <h3 className="text-2xl font-bold">
                  {verificationResult === 'genuine' ? 'Genuine Product ✓' : 'Counterfeit Detected ✗'}
                </h3>
                <p className="text-slate-300 mt-1">
                  {verificationResult === 'genuine'
                    ? 'This product has been verified on the blockchain'
                    : 'This product could not be verified. Please contact the seller.'}
                </p>
              </div>
            </div>
            
            {verificationResult === 'genuine' && (
              <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Product ID</p>
                    <p className="font-mono text-cyan-400">PRD-2026-8472</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Manufacturer</p>
                    <p className="font-semibold">TechCorp Industries</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Mfg. Date</p>
                    <p className="font-semibold">Jan 15, 2026</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Blockchain Hash</p>
                    <p className="font-mono text-xs text-cyan-400 truncate">0x7f3c2a...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
