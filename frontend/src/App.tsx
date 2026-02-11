import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import Notification from './components/Notification';
import Login from './components/Login';
import AssistantCard from './components/AssistantCard';
import RpaCard from './components/RpaCard';
import { getTransactions } from './services/api';
import { useWebSocket } from './hooks/useWebSocket';
import { Transaction } from './types';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LogOut, LayoutDashboard } from 'lucide-react';

const MainApp = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [pagination, setPagination] = useState({ page: 1, size: 10, total: 0, pages: 1 });
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const { logout } = useAuth();
  
  const lastMessage = useWebSocket();

  const fetchTransactions = async (page = 1) => {
    try {
      const data = await getTransactions(page, pagination.size);
      setTransactions(data.items);
      setPagination({
        page: data.page,
        size: data.size,
        total: data.total,
        pages: data.pages
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const handleTransactionCreated = () => {
    // Refresh to get correct order and pagination
    fetchTransactions(1); 
    setNotification({ message: 'Transacción creada exitosamente', type: 'success' });
  };

  const handlePageChange = (newPage: number) => {
      fetchTransactions(newPage);
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  useEffect(() => {
    if (lastMessage) {
      console.log('WS Update:', lastMessage);
      if (lastMessage.type === 'transaction_update') {
        const { transaction_id, status, updated_at } = lastMessage.data;
        
        // Update local state if the transaction is in the current view
        setTransactions((prev) => 
          prev.map((tx) => 
            tx.id === transaction_id ? { ...tx, status, processed_at: updated_at } : tx
          )
        );

        // Show notification
        const statusText = status === 'procesado' ? 'Procesada' : 'Fallida';
        setNotification({
          message: `Transacción ${statusText}: ${transaction_id.slice(0, 8)}...`,
          type: status === 'procesado' ? 'success' : 'error'
        });
      }
    }
  }, [lastMessage]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="bg-purple-600 p-2 rounded-lg">
                <LayoutDashboard className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-gray-900">
                TRUE <span className="text-purple-600">TALENT</span>
              </h1>
            </div>
            <div className="flex items-center">
              <button 
                onClick={logout}
                className="inline-flex items-center gap-2 bg-white text-gray-700 hover:text-red-600 font-medium py-2 px-4 rounded-lg border border-gray-300 hover:border-red-300 transition-colors duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Cerrar Sesión</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Form */}
            <div className="lg:col-span-1 space-y-6">
                <TransactionForm onTransactionCreated={handleTransactionCreated} />
                
                <AssistantCard />
                <RpaCard />

                {/* Stats Card (Optional Placeholder for professional look) */}
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                    <h3 className="text-lg font-semibold opacity-90 mb-1">Total Transacciones</h3>
                    <p className="text-4xl font-bold">{pagination.total}</p>
                    <div className="mt-4 flex items-center text-sm opacity-80">
                        <span>Actualizado en tiempo real</span>
                        <div className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    </div>
                </div>
            </div>

            {/* Right Column: List */}
            <div className="lg:col-span-2">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-gray-800">Historial de Operaciones</h2>
                </div>
                <TransactionList 
                    transactions={transactions} 
                    pagination={pagination}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>

        <Notification 
          message={notification?.message || null} 
          type={notification?.type || 'success'} 
          onClose={() => setNotification(null)} 
        />
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <p className="text-sm text-gray-500 font-medium">
            Desarrollador Ricardo Altamirano Sanchez
          </p>
        </div>
      </footer>
    </div>
  );
};

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  
  return children;
};

// Route wrapper for Login: if authenticated, redirect to dashboard
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
     return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route 
            path="/" 
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <MainApp />
              </ProtectedRoute>
            } 
          />
          {/* Catch all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;