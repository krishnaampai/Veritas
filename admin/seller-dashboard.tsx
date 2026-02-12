import { ArrowLeft, Store } from 'lucide-react';
import { useNavigate } from 'react-router';

export function SellerPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <header className="p-6 flex items-center gap-4 border-b border-slate-700/50">
        <button
          onClick={() => navigate('/')}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft className="size-6" />
        </button>
        <div className="flex items-center gap-3">
          <Store className="size-8 text-purple-400" />
          <h1 className="text-3xl font-bold">VERITAS</h1>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-8 py-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Seller Dashboard</h2>
        <p className="text-slate-300 text-lg">Coming Soon</p>
      </div>
    </div>
  );
}
