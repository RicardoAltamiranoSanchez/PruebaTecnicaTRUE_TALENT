import React, { useState } from 'react';
import { createTransaction } from '../services/api';
import { v4 as uuidv4 } from 'uuid';
import { Transaction } from '../types';
import { PlusCircle, Loader } from 'lucide-react';

interface Props {
  onTransactionCreated: (transaction: Transaction) => void;
}

const TransactionForm: React.FC<Props> = ({ onTransactionCreated }) => {
  const [monto, setMonto] = useState('');
  const [tipo, setTipo] = useState<'compra' | 'venta' | 'transferencia'>('compra');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!monto) return;

    setLoading(true);
    try {
      const newTx = await createTransaction({
        user_id: uuidv4(),
        monto: parseFloat(monto),
        tipo,
      });
      onTransactionCreated(newTx);
      setMonto('');
    } catch (error) {
      console.error(error);
      // Ideally show a toast here instead of alert, but alert is fine for now
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl border border-purple-100 mb-8 transition-all hover:shadow-2xl">
      <div className="flex items-center mb-6">
        <div className="bg-purple-100 p-2 rounded-lg mr-3">
            <PlusCircle className="w-6 h-6 text-purple-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Nueva Operación</h2>
           
      </div>
        <p className="text-xs text-blue-600 mb-4 uppercase tracking-wider font-semibold bg-blue-50 inline-block px-2 py-1 rounded">
                Parte 1 y 2:  Backend y Frontend
            </p>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 tracking-wide">Monto de la Transacción</label>
            <div className="relative">
                <span className="absolute left-3 top-3 text-gray-400 font-bold">$</span>
                <input
                    type="number"
                    value={monto}
                    onChange={(e) => setMonto(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium text-gray-700"
                    placeholder="0.00"
                    required
                />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-600 tracking-wide">Tipo de Operación</label>
            <div className="relative">
                <select
                    value={tipo}
                    onChange={(e) => setTipo(e.target.value as any)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-medium text-gray-700 appearance-none"
                >
                    <option value="compra">Compra</option>
                    <option value="venta">Venta</option>
                    <option value="transferencia">Transferencia</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:-translate-y-0.5 shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2"
        >
          {loading ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                Procesando...
              </>
          ) : (
              <>
                Confirmar Transacción
              </>
          )}
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;