import { useState } from 'react';
import { triggerRpa } from '../services/api';
import { Loader2, Play, Search, CheckCircle, AlertCircle, Bot } from 'lucide-react';

const RpaCard = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleRunRpa = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        setResult(null);
        setError('');

        try {
            const response = await triggerRpa(searchTerm);
            setResult(response);
        } catch (err: any) {
            console.error('Error running RPA:', err);
            setError('Error al ejecutar el RPA. Verifique que el servicio esté activo.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 p-2 rounded-lg">
                    <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="text-lg font-bold text-gray-800">RPA System Bot</h3>
                    <p className="text-xs text-gray-500 font-medium">Automatización de Tareas</p>
                </div>
            </div>
            
            <p className="text-xs text-blue-600 mb-4 uppercase tracking-wider font-semibold bg-blue-50 inline-block px-2 py-1 rounded">
                Parte 4: RPA 
            </p>

            <div className="space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                    <input
                        type="text"
                        className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all text-sm text-gray-700 placeholder-gray-400"
                        placeholder="Término para buscar y procesar..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={handleRunRpa}
                    disabled={loading || !searchTerm.trim()}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold transition-all duration-200 ${
                        loading || !searchTerm.trim()
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-lg hover:-translate-y-0.5'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span>Ejecutando Bot...</span>
                        </>
                    ) : (
                        <>
                            <Play className="w-4 h-4 fill-current" />
                            <span>Iniciar RPA</span>
                        </>
                    )}
                </button>

                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm flex items-start gap-2 animate-in fade-in slide-in-from-top-1">
                        <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
                        <p>{error}</p>
                    </div>
                )}

                {result && result.status === 'success' && (
                    <div className="mt-6 p-4 bg-green-50 border border-green-100 rounded-xl animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center gap-2 mb-3 text-green-700 font-bold">
                            <CheckCircle className="w-5 h-5" />
                            <h4>Proceso Completado</h4>
                        </div>
                        
                        <div className="space-y-3 text-sm text-gray-700">
                            <div className="flex justify-between border-b border-green-200 pb-2">
                                <span className="text-gray-500">Acción:</span>
                                <span className="font-medium">Wiki Search & Summarize</span>
                            </div>
                            <div className="flex justify-between border-b border-green-200 pb-2">
                                <span className="text-gray-500">Estado:</span>
                                <span className="font-medium text-green-600">Resumen Generado (Sin Transacción)</span>
                            </div>
                            
                            <div>
                                <span className="text-gray-500 block mb-1">Texto Original (Wikipedia):</span>
                                <p className="text-gray-600 bg-white/50 p-2 rounded border border-green-100 text-xs leading-relaxed max-h-24 overflow-y-auto">
                                    "{result.data.original_text}"
                                </p>
                            </div>

                            <div>
                                <span className="text-gray-500 block mb-1">Respuesta de IA (/assistant/summarize):</span>
                                <p className="text-gray-600 italic bg-blue-50/50 p-2 rounded border border-blue-100 text-xs leading-relaxed">
                                    "{result.data.wiki_summary}"
                                </p>
                            </div>
                            
                            {result.data.steps && result.data.steps.length > 0 && (
                                <div className="mt-3">
                                    <span className="text-gray-500 block mb-1">Registro de Pasos (RPA):</span>
                                    <div className="bg-white/50 p-2 rounded border border-green-100 text-xs space-y-1 font-mono text-gray-600">
                                        {result.data.steps.map((step: string, idx: number) => (
                                            <div key={idx} className="flex gap-2">
                                                <span className="text-green-600 font-bold">✓</span>
                                                <span>{step}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RpaCard;
