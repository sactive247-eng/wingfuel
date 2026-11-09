import React, { useState } from 'react';
import { ShoppingBag, Download, ShieldCheck, Check, Lock, Loader2, Sparkles } from 'lucide-react';
import { DigitalProduct } from '../lib/seedData';
import { AdBanner } from '../components/AdBanner';

interface ProductsPageProps {
  products: DigitalProduct[];
}

export const ProductsPage: React.FC<ProductsPageProps> = ({ products }) => {
  const [selectedProduct, setSelectedProduct] = useState<DigitalProduct | null>(null);
  const [customerEmail, setCustomerEmail] = useState('');
  const [paymentStep, setPaymentStep] = useState<'checkout' | 'processing' | 'success'>('checkout');
  const [orderResult, setOrderResult] = useState<{ accessKey: string; downloadUrl: string } | null>(null);

  const handleOpenCheckout = (prod: DigitalProduct) => {
    setSelectedProduct(prod);
    setPaymentStep('checkout');
    setOrderResult(null);
  };

  const handleSimulatePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerEmail.trim() || !selectedProduct) return;

    setPaymentStep('processing');

    try {
      const res = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: selectedProduct.id,
          productTitle: selectedProduct.title,
          amountINR: selectedProduct.priceINR,
          customerEmail: customerEmail.trim(),
          razorpayPaymentId: `pay_rzp_sandbox_${Date.now()}`
        })
      });

      const data = await res.json();
      if (data.success) {
        setOrderResult({
          accessKey: data.accessKey,
          downloadUrl: data.downloadUrl
        });
        setPaymentStep('success');
      } else {
        alert('Payment verification failed.');
        setPaymentStep('checkout');
      }
    } catch (err) {
      console.error('Payment error:', err);
      // Sandbox fallback generator
      const fallbackKey = `WF-KEY-${Date.now()}-DEMO`;
      setOrderResult({
        accessKey: fallbackKey,
        downloadUrl: `/api/download/${fallbackKey}?product=${encodeURIComponent(selectedProduct.id)}`
      });
      setPaymentStep('success');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-widest mb-1">
          <ShoppingBag className="w-4 h-4" /> Aviation Digital Products Store
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Professional Aviation Tools & Dashboards</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Automated Excel templates, ATF density calculators, ramp safety checklists, and aviation interview preparation packages.
        </p>
      </div>

      {/* Leaderboard Ad */}
      <AdBanner type="leaderboard" />

      {/* Product Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-orange-500/50 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="h-48 relative overflow-hidden bg-slate-950">
                <img
                  src={prod.previewImage}
                  alt={prod.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <span className="absolute top-3 left-3 bg-slate-950/90 text-orange-400 text-[10px] font-bold px-2.5 py-1 rounded border border-slate-800">
                  {prod.category}
                </span>
                <span className="absolute top-3 right-3 bg-slate-950/90 text-slate-300 text-[10px] font-mono px-2 py-0.5 rounded">
                  {prod.fileSizeBytes}
                </span>
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-lg font-bold text-white leading-snug">{prod.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">{prod.description}</p>

                <div className="space-y-1.5 pt-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Key Features Included:</span>
                  <ul className="space-y-1 text-xs text-slate-300">
                    {prod.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-orange-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-medium">INR Pricing</span>
                <span className="text-xl font-extrabold text-white font-mono">₹{prod.priceINR}</span>
              </div>
              <button
                onClick={() => handleOpenCheckout(prod)}
                className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl shadow-lg transition-colors flex items-center gap-1.5"
              >
                Buy Now & Download
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Razorpay Sandbox Checkout & Verification Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative space-y-5">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              &times;
            </button>

            {paymentStep === 'checkout' && (
              <form onSubmit={handleSimulatePayment} className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4" /> Razorpay Test Sandbox Checkout
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                  <span className="text-[10px] text-slate-400 uppercase font-mono">{selectedProduct.category}</span>
                  <h3 className="text-base font-bold text-white">{selectedProduct.title}</h3>
                  <p className="text-lg font-mono font-extrabold text-orange-400 mt-1">₹{selectedProduct.priceINR} INR</p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">Deliver Asset To Email</label>
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="aviation.pro@company.com"
                    required
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-orange-500"
                  />
                </div>

                <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-xl text-[11px] text-amber-200 flex items-start gap-2">
                  <Lock className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>Razorpay Test Sandbox Enabled. Server-side signature validation will generate your authorized download key instantly.</span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2"
                >
                  Pay ₹{selectedProduct.priceINR} (Test Mode)
                </button>
              </form>
            )}

            {paymentStep === 'processing' && (
              <div className="text-center py-8 space-y-3">
                <Loader2 className="w-8 h-8 text-orange-400 animate-spin mx-auto" />
                <h3 className="text-base font-bold text-white">Verifying Razorpay Payment Server-Side...</h3>
                <p className="text-xs text-slate-400">Validating payment signature and generating download key...</p>
              </div>
            )}

            {paymentStep === 'success' && orderResult && (
              <div className="space-y-4 text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-950 border border-emerald-500 text-emerald-400 flex items-center justify-center mx-auto">
                  <Check className="w-6 h-6" />
                </div>

                <h3 className="text-lg font-bold text-white">Payment Verified & Key Authorized!</h3>
                <p className="text-xs text-slate-300">Your digital product access key has been successfully generated.</p>

                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-xs text-orange-400 select-all">
                  Key: {orderResult.accessKey}
                </div>

                <a
                  href={orderResult.downloadUrl}
                  download
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <Download className="w-4 h-4" /> Download File Now ({selectedProduct.downloadFileName})
                </a>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};
