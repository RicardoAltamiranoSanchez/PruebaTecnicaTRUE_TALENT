import React from 'react';
import { Transaction } from '../types';
import clsx from 'clsx';
import { ChevronLeft, ChevronRight, FileText, Calendar, DollarSign, Activity } from 'lucide-react';

interface Props {
  transactions: Transaction[];
  pagination: {
    page: number;
    size: number;
    total: number;
    pages: number;
  };
  onPageChange: (page: number) => void;
}

const TransactionList: React.FC<Props> = ({ transactions, pagination, onPageChange }) => {
  return (
    <div className="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                   <Activity className="w-4 h-4 text-purple-600" />
                   Tipo
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                   <DollarSign className="w-4 h-4 text-green-600" />
                   Monto
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                 Estado
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="flex items-center gap-2">
                   <Calendar className="w-4 h-4 text-blue-600" />
                   Fecha
                </div>
              </th>
              <th scope="col" className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                 ID Referencia
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((tx) => (
              <tr key={tx.id} className="hover:bg-gray-50 transition-colors duration-150">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className={clsx(
                      "flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center",
                      tx.tipo === 'compra' && 'bg-blue-100 text-blue-600',
                      tx.tipo === 'venta' && 'bg-purple-100 text-purple-600',
                      tx.tipo === 'transferencia' && 'bg-indigo-100 text-indigo-600'
                    )}>
                      <FileText className="h-5 w-5" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-bold text-gray-900 capitalize">{tx.tipo}</div>
                      <div className="text-xs text-gray-500">Operación estándar</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    ${parseFloat(tx.monto.toString()).toFixed(2)}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={clsx(
                      'px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full shadow-sm',
                      tx.status === 'procesado' && 'bg-green-100 text-green-800 border border-green-200',
                      tx.status === 'pendiente' && 'bg-yellow-100 text-yellow-800 border border-yellow-200',
                      tx.status === 'fallido' && 'bg-red-100 text-red-800 border border-red-200'
                    )}
                  >
                    {tx.status.toUpperCase()}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(tx.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400 font-mono">
                  {tx.id.slice(0, 8)}...{tx.id.slice(-4)}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
                <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                        No hay transacciones registradas.
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200 sm:px-6">
        <div className="flex items-center justify-between">
          <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-gray-700">
                Mostrando <span className="font-medium">{Math.min((pagination.page - 1) * pagination.size + 1, pagination.total)}</span> a <span className="font-medium">{Math.min(pagination.page * pagination.size, pagination.total)}</span> de <span className="font-medium">{pagination.total}</span> resultados
              </p>
            </div>
            <div>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                <button
                  onClick={() => onPageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Anterior</span>
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                {/* Simple page numbers */}
                {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                    // Show limited pages logic can be complex, for now show all if < 10, or just simplified
                    <button
                        key={page}
                        onClick={() => onPageChange(page)}
                        className={clsx(
                            "relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                            pagination.page === page 
                                ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600" 
                                : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                        )}
                    >
                        {page}
                    </button>
                ))}
                <button
                  onClick={() => onPageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed"
                >
                  <span className="sr-only">Siguiente</span>
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionList;