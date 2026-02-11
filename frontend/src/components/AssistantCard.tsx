import { useState } from 'react';
import { summarizeText } from '../services/api';
import { Loader2, Copy, Bot, Sparkles, Check } from 'lucide-react';

const AssistantCard = () => {
    const [text, setText] = useState('');
    const [summary, setSummary] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);
    const [isSimulated, setIsSimulated] = useState(false);

    const handleSummarize = async () => {
        if (!text.trim()) return;

        setLoading(true);
        setSummary('');
        setCopied(false);
        setIsSimulated(false);

        try {
            const response = await summarizeText(text);
            setSummary(response.summary);
            
            // Check if simulated based on response content
            if (response.summary.includes('Resumen simulado') || response.summary.includes('IA no configurada')) {
                setIsSimulated(true);
            }
        } catch (error) {
            console.error('Error summarizing text:', error);
            setSummary('Error al generar el resumen. Por favor intente nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (!summary) return;
        navigator.clipboard.writeText(summary);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
            <div className="flex items-center gap-2 mb-4">
                <div className="bg-purple-100 p-2 rounded-lg">
                    <Bot className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800">Asistente IA</h3>
            </div>
            
          <p className="text-xs text-blue-600 mb-4 uppercase tracking-wider font-semibold bg-blue-50 inline-block px-2 py-1 rounded">
    
                Parte 3: Integración OpenAI
            </p>
          
            <div className="space-y-4">
                <div>
                    <textarea
                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all resize-none text-sm text-gray-700 placeholder-gray-400"
                        rows={4}
                        placeholder="Pega aquí el texto que deseas resumir..."
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        disabled={loading}
                    />
                </div>

                <button
                    onClick={handleSummarize}
                    disabled={loading || !text.trim()}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-medium transition-all duration-200 ${
                        loading || !text.trim()
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md hover:shadow-lg'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Procesando...</span>
                        </>
                    ) : (
                        <>
                            <Sparkles className="w-4 h-4 text-yellow-400" />
                            <span>Resumir Texto</span>
                        </>
                    )}
                </button>

                {summary && (
                    <div className="mt-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="flex justify-between items-center mb-2">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full ${
                                isSimulated 
                                    ? 'bg-yellow-100 text-yellow-700 border border-yellow-200'
                                    : 'bg-green-100 text-green-700 border border-green-200'
                            }`}>
                                {isSimulated ? 'Simulado' : 'OpenAI'}
                            </span>
                            
                            <button 
                                onClick={handleCopy}
                                className="text-gray-400 hover:text-purple-600 transition-colors"
                                title="Copiar resumen"
                            >
                                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                            </button>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                                {summary}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssistantCard;
