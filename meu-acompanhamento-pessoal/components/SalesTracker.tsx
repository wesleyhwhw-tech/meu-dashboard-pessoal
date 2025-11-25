
import React, { useState, useCallback } from 'react';
import { type Product, type Sale, type SalesScript } from '../types';
import { Card } from './Card';
import { generateSalesScript } from '../services/geminiService';
import ReactMarkdown from 'react-markdown';

// --- Helper Functions ---
const toBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
});

// --- Sub-components ---

const AddProductForm: React.FC<{ addProduct: (p: Omit<Product, 'id'>) => void }> = ({ addProduct }) => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [media, setMedia] = useState<string | undefined>();

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const base64 = await toBase64(e.target.files[0]);
            setMedia(base64);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!name || !price) return;
        addProduct({ name, description, price: parseFloat(price), media });
        setName(''); setDescription(''); setPrice(''); setMedia(undefined);
    };

    return (
        <Card>
            <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="text-lg font-medium">Cadastrar Produto</h3>
                <input type="text" placeholder="Nome do Produto" value={name} onChange={e => setName(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <textarea placeholder="Descrição" value={description} onChange={e => setDescription(e.target.value)} rows={3} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" />
                <input type="number" placeholder="Preço (R$)" value={price} onChange={e => setPrice(e.target.value)} required className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600" min="0" step="0.01" />
                <div>
                     <label className="text-sm">Imagem (Opcional)</label>
                     <input type="file" accept="image/*" onChange={handleFileChange} className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                </div>
                {media && <img src={media} alt="Preview" className="w-24 h-24 object-cover rounded-md mx-auto" />}
                <button type="submit" className="w-full p-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Adicionar Produto</button>
            </form>
        </Card>
    );
};

const SalesScriptGenerator: React.FC<{ products: Product[], addSalesScript: (s: Omit<SalesScript, 'id'>) => void }> = ({ products, addSalesScript }) => {
    const [selectedProductId, setSelectedProductId] = useState('');
    const [script, setScript] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleGenerateScript = useCallback(async () => {
        const product = products.find(p => p.id === selectedProductId);
        if (!product) return;
        setIsLoading(true);
        setScript('');
        try {
            const result = await generateSalesScript(product);
            setScript(result);
        } catch(err) {
            console.error(err);
            setScript("Erro ao gerar o roteiro.");
        } finally {
            setIsLoading(false);
        }
    }, [selectedProductId, products]);

    const handleSaveScript = () => {
        const product = products.find(p => p.id === selectedProductId);
        if(!product || !script) return;
        addSalesScript({ productId: product.id, productName: product.name, script });
        setScript('');
        setSelectedProductId('');
    }

    if (products.length === 0) return null;

    return (
        <Card>
            <h3 className="text-lg font-medium mb-4">Gerador de Roteiro de Venda (IA)</h3>
            <div className="space-y-4">
                <select value={selectedProductId} onChange={e => setSelectedProductId(e.target.value)} className="w-full p-2 border rounded bg-gray-50 dark:bg-gray-700 dark:border-gray-600">
                    <option value="">Selecione um produto</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                </select>
                <button onClick={handleGenerateScript} disabled={!selectedProductId || isLoading} className="w-full p-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400">
                    {isLoading ? "Gerando..." : "Gerar Roteiro"}
                </button>
                {script && (
                    <div className="prose prose-sm dark:prose-invert max-w-none p-4 border rounded-md bg-gray-50 dark:bg-gray-900">
                        <ReactMarkdown>{script}</ReactMarkdown>
                        <button onClick={handleSaveScript} className="w-full mt-4 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar Roteiro</button>
                    </div>
                )}
            </div>
        </Card>
    );
}


// --- Main Component ---

interface SalesTrackerProps {
  products: Product[];
  sales: Sale[];
  scripts: SalesScript[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  addSale: (sale: Omit<Sale, 'id'>) => void;
  deleteSale: (id: string) => void;
  addSalesScript: (script: Omit<SalesScript, 'id'>) => void;
  deleteSalesScript: (id: string) => void;
}

export const SalesTracker: React.FC<SalesTrackerProps> = (props) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
            <AddProductForm addProduct={props.addProduct} />
             <SalesScriptGenerator products={props.products} addSalesScript={props.addSalesScript} />
        </div>
        <div className="lg:col-span-2 space-y-6">
             <Card>
                <h3 className="text-lg font-medium mb-4">Meus Produtos</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {props.products.map(p => (
                        <div key={p.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded-md">
                            <div className="flex items-center gap-4">
                               {p.media && <img src={p.media} className="w-10 h-10 object-cover rounded"/>}
                               <div>
                                  <p className="font-semibold">{p.name}</p>
                                  <p className="text-sm text-green-500">{p.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</p>
                               </div>
                            </div>
                            <button onClick={() => props.deleteProduct(p.id)} className="text-red-500 hover:text-red-700">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                        </div>
                    ))}
                    {props.products.length === 0 && <p className="text-sm text-center text-gray-500 py-4">Nenhum produto cadastrado.</p>}
                </div>
             </Card>
             <Card>
                <h3 className="text-lg font-medium mb-4">Roteiros Salvos</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                    {props.scripts.map(s => (
                        <div key={s.id} className="p-3 bg-gray-50 dark:bg-gray-700 rounded-md relative">
                            <button onClick={() => props.deleteSalesScript(s.id)} className="absolute top-2 right-2 text-red-500 hover:text-red-700"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>
                            <p className="font-semibold text-indigo-500">{s.productName}</p>
                            <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap"><ReactMarkdown>{s.script}</ReactMarkdown></div>
                        </div>
                    ))}
                    {props.scripts.length === 0 && <p className="text-sm text-center text-gray-500 py-4">Nenhum roteiro salvo.</p>}
                </div>
            </Card>
        </div>
    </div>
  );
};
