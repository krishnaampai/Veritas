import { useState } from 'react';
import { ArrowLeft, Plus, Factory, QrCode, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router';

export function ManufacturerPage() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    productName: '',
    productId: '',
    mfgDate: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate blockchain registration
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setSubmitted(false);
        setShowForm(false);
        setFormData({ productName: '', productId: '', mfgDate: '' });
      }, 3000);
    }, 2000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          <Factory className="size-8 text-indigo-400" />
          <h1 className="text-3xl font-bold">VERITAS</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">Manufacturer Dashboard</h2>
          <p className="text-slate-300 text-lg">
            Register and manage your products on the blockchain
          </p>
        </div>

        {/* Add New Product Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="w-full md:w-auto mx-auto flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 rounded-xl text-xl font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
          >
            <Plus className="size-6" />
            Add New Product
          </button>
        )}

        {/* Product Registration Form */}
        {showForm && !submitted && (
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Factory className="size-7 text-indigo-400" />
              Register New Product
            </h3>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <div>
                <label htmlFor="productName" className="block text-sm font-medium text-slate-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  id="productName"
                  name="productName"
                  value={formData.productName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="Enter product name"
                />
              </div>

              {/* Product ID */}
              <div>
                <label htmlFor="productId" className="block text-sm font-medium text-slate-300 mb-2">
                  Product ID
                </label>
                <input
                  type="text"
                  id="productId"
                  name="productId"
                  value={formData.productId}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  placeholder="e.g., PRD-2026-XXXX"
                />
              </div>

              {/* Manufacturing Date */}
              <div>
                <label htmlFor="mfgDate" className="block text-sm font-medium text-slate-300 mb-2">
                  Manufacturing Date
                </label>
                <input
                  type="date"
                  id="mfgDate"
                  name="mfgDate"
                  value={formData.mfgDate}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 bg-slate-900 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>

              {/* QR Code Generation Section */}
              <div className="p-6 bg-slate-900/50 border border-slate-700 rounded-xl">
                <div className="flex items-center gap-3 mb-4">
                  <QrCode className="size-6 text-indigo-400" />
                  <h4 className="text-lg font-semibold">QR Code Generation</h4>
                </div>
                <p className="text-slate-400 text-sm mb-4">
                  A unique QR code will be automatically generated upon registration
                </p>
                <div className="w-32 h-32 bg-slate-800 border-2 border-dashed border-slate-600 rounded-lg flex items-center justify-center">
                  <QrCode className="size-12 text-slate-600" />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 disabled:from-slate-700 disabled:to-slate-700 disabled:cursor-not-allowed rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-indigo-500/50"
                >
                  {isSubmitting ? 'Registering on Blockchain...' : 'Register Product on Blockchain'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  disabled={isSubmitting}
                  className="px-6 py-4 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 disabled:cursor-not-allowed rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Success Message */}
        {submitted && (
          <div className="bg-green-500/10 border-2 border-green-500 rounded-2xl p-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center gap-4 mb-4">
              <CheckCircle className="size-12 text-green-500" strokeWidth={2} />
              <div>
                <h3 className="text-2xl font-bold text-green-500">Product Registered Successfully!</h3>
                <p className="text-slate-300 mt-1">
                  Your product has been securely registered on the blockchain
                </p>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-900/50 rounded-lg">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-400">Product Name</p>
                  <p className="font-semibold">{formData.productName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Product ID</p>
                  <p className="font-mono text-indigo-400">{formData.productId}</p>
                </div>
                <div>
                  <p className="text-slate-400">Mfg. Date</p>
                  <p className="font-semibold">{formData.mfgDate}</p>
                </div>
                <div>
                  <p className="text-slate-400">Blockchain Hash</p>
                  <p className="font-mono text-xs text-indigo-400">0x4a9f8b...</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Stats Section */}
        {!showForm && !submitted && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-2">Total Products</p>
              <p className="text-3xl font-bold">247</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-2">This Month</p>
              <p className="text-3xl font-bold">42</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <p className="text-slate-400 text-sm mb-2">Verified</p>
              <p className="text-3xl font-bold text-green-500">99.8%</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
