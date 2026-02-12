import { Shield, Factory, Store, Scan } from 'lucide-react';
import { useNavigate } from 'react-router';

export function LandingPage() {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Admin',
      icon: Shield,
      path: '/admin',
      color: 'from-blue-600 to-blue-700'
    },
    {
      title: 'Manufacturer',
      icon: Factory,
      path: '/manufacturer',
      color: 'from-indigo-600 to-indigo-700'
    },
    {
      title: 'Seller',
      icon: Store,
      path: '/seller',
      color: 'from-purple-600 to-purple-700'
    },
    {
      title: 'Customer',
      icon: Scan,
      path: '/customer',
      color: 'from-cyan-600 to-cyan-700'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="pt-16 pb-12 text-center">
        <div className="mb-4 flex items-center justify-center gap-3">
          <Shield className="size-12 text-cyan-400" strokeWidth={2} />
          <h1 className="text-6xl font-bold tracking-tight">VERITAS</h1>
        </div>
        <p className="text-xl text-slate-300 max-w-2xl mx-auto px-4">
          Blockchain-Based Product Authentication System
        </p>
        <div className="mt-6 h-1 w-32 bg-gradient-to-r from-cyan-500 to-blue-500 mx-auto rounded-full"></div>
      </header>

      {/* Cards Grid */}
      <div className="max-w-6xl mx-auto px-8 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.title}
                onClick={() => navigate(card.path)}
                className="group relative overflow-hidden rounded-2xl bg-slate-800/50 backdrop-blur-sm border border-slate-700 hover:border-slate-600 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-cyan-500/20"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                <div className="relative p-12 flex flex-col items-center gap-6">
                  <div className={`p-6 rounded-2xl bg-gradient-to-br ${card.color} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="size-16 text-white" strokeWidth={1.5} />
                  </div>
                  <h2 className="text-3xl font-semibold tracking-wide">
                    {card.title}
                  </h2>
                  <div className="w-16 h-1 bg-gradient-to-r from-transparent via-slate-600 to-transparent group-hover:via-cyan-400 transition-colors duration-300"></div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Decorative blockchain elements */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-20">
        <div className="absolute top-20 left-10 w-64 h-64 bg-cyan-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
      </div>
    </div>
  );
}
