import React, { useState } from 'react';
import { CheckSquare, Copy, Download, FileText, Users, Settings, RotateCcw } from 'lucide-react';

interface ChecklistItem {
  id: string;
  question: string;
  description: string;
  checked: boolean;
  response: string;
}

function App() {
  const [copySuccess, setCopySuccess] = useState(false);
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    {
      id: 'logic',
      question: 'A lógica está clara e simples?',
      description: 'Explique o raciocínio adotado, se houver alguma regra específica.',
      checked: false,
      response: ''
    },
    {
      id: 'naming',
      question: 'Nomes de variáveis e funções estão descritivos?',
      description: 'Evite abreviações e nomes genéricos como `data`, `info`, etc.',
      checked: false,
      response: ''
    },
    {
      id: 'deadcode',
      question: 'Não há código morto, comentado ou desnecessário?',
      description: 'Se houve limpeza, mencione brevemente.',
      checked: false,
      response: ''
    },
    {
      id: 'validation',
      question: 'Validação de campos obrigatórios foi feita?',
      description: 'Liste os campos críticos e como foram validados.',
      checked: false,
      response: ''
    },
    {
      id: 'datavalidation',
      question: 'Validação de dados numéricos, strings e limites?',
      description: 'Inclua exemplos, se houver validações customizadas.',
      checked: false,
      response: ''
    },
    {
      id: 'errorhandling',
      question: 'Tratamento de erros e exceções adicionado?',
      description: 'Como o sistema reage a falhas nessa funcionalidade?',
      checked: false,
      response: ''
    },
    {
      id: 'documentation',
      question: 'Documentação atualizada',
      description: 'Swagger ou parâmetrizações foram atualizadas?',
      checked: false,
      response: ''
    },
    {
      id: 'bug',
      question: 'É um Bug?',
      description: 'Descreva o que aconteceu, por que ocorreu e como foi resolvido.',
      checked: false,
      response: ''
    },
    {
      id: 'regression',
      question: 'Realizado teste de regressão?',
      description: 'Foi verificado se funcionalidades antigas continuam funcionando após uma mudança no código',
      checked: false,
      response: ''
    }
  ]);

  const [additionalObservations, setAdditionalObservations] = useState('');

  const clearAllFields = () => {
    setChecklist(prev => prev.map(item => ({
      ...item,
      checked: false,
      response: ''
    })));
    setAdditionalObservations('');
  };

  const updateChecklistItem = (id: string, field: 'checked' | 'response', value: boolean | string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        [field]: value,
        // Clear response when unchecking the item
        ...(field === 'checked' && value === false ? { response: '' } : {})
      } : item
    ));
  };

  const generateChecklistText = () => {
    let output = `##CHECKLIST##
*Documentação de Desenvolvimento (Checklist do PR)*
 
Preencha os campos abaixo antes de submeter sua Pull Request. Seja objetivo, mas claro.
 
---
 
`;

    checklist.forEach(item => {
      output += `- [${item.checked ? 'x' : ' '}] **${item.question}**  
*${item.description}*  
Resposta: ${item.response}
 
---
 
`;
    });

    output += `- [ ] Observações adicionais (opcional):
Resposta: ${additionalObservations}`;

    return output;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateChecklistText());
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const downloadChecklist = () => {
    const element = document.createElement('a');
    const file = new Blob([generateChecklistText()], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'pr-checklist.md';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const completedItems = checklist.filter(item => item.checked).length;
  const progressPercentage = (completedItems / checklist.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center justify-center w-10 h-10 bg-orange-500 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gerador de documentação de PR</h1>
                <p className="text-sm text-gray-600">Ferramenta para simplificação na documentação de Pull Requests</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <img 
                src="/myp7-pdf-relatorios.png" 
                alt="MYP-7 Logo" 
                className="h-8 w-auto"
              />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Bar */}
        <div className="mb-8 bg-white rounded-xl shadow-sm p-6 col-span-2">
          <div className="flex items-center justify-between mb-3">
           <h2 className="text-lg font-semibold text-gray-900">Itens Aplicáveis Marcados</h2>
           <span className="text-sm font-medium text-gray-600">{completedItems}/{checklist.length} itens marcados como aplicáveis</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
             className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
         <p className="text-xs text-gray-500 mt-2">
           Esta barra mostra quantos itens você marcou como aplicáveis ao seu PR. Não é necessário marcar todos.
         </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column - Checklist Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Checklist de Desenvolvimento</h2>
                <div className="flex items-center justify-between">
                  <p className="text-gray-600">Preencha os campos abaixo antes de submeter sua Pull Request. Seja objetivo, mas claro.</p>
                  <button
                    onClick={clearAllFields}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Limpar Campos
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100 max-h-[70vh] overflow-y-auto">
                {checklist.map((item, index) => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors duration-200">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0 pt-1 relative">
                        <button
                          onClick={() => updateChecklistItem(item.id, 'checked', !item.checked)}
                          className={`w-8 h-8 rounded-lg border-2 transition-all duration-200 flex items-center justify-center shadow-sm hover:shadow-md ${
                            item.checked 
                              ? 'bg-orange-500 border-orange-500 text-white scale-105' 
                              : 'border-gray-400 hover:border-orange-400 bg-white hover:bg-orange-50'
                          }`}
                        >
                          {item.checked && <CheckSquare className="w-5 h-5" />}
                        </button>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-sm font-bold ${
                            item.checked 
                              ? 'bg-orange-100 text-orange-700' 
                              : 'bg-orange-100 text-orange-700'
                          }`}>
                            {index + 1}
                          </span>
                          <h3 className={`text-lg font-medium ${
                            item.checked ? 'text-orange-800' : 'text-gray-900'
                          }`}>
                            {item.question}
                          </h3>
                        </div>
                        
                        <p className="text-gray-600 mb-4 italic">{item.description}</p>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                           Resposta {item.checked ? '(obrigatória)' : '(opcional)'}:
                          </label>
                          <textarea
                            value={item.response}
                            onChange={(e) => updateChecklistItem(item.id, 'response', e.target.value)}
                            placeholder={item.checked ? "Descreva sua resposta aqui..." : "Marque o item acima para habilitar este campo"}
                            disabled={!item.checked}
                            className={`w-full px-4 py-3 border rounded-lg resize-none transition-all duration-200 ${
                              item.checked 
                                ? 'border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white text-gray-900' 
                                : 'border-gray-200 bg-gray-50 text-gray-400 cursor-not-allowed'
                            }`}
                            rows={3}
                          />
                          {!item.checked && (
                            <p className="text-xs text-gray-500 mt-1 flex items-center">
                              <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                              </svg>
                              Marque o checkbox acima para habilitar este campo
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Additional Observations */}
                <div className="p-6 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Observações Adicionais (opcional)</h3>
                  <textarea
                    value={additionalObservations}
                    onChange={(e) => setAdditionalObservations(e.target.value)}
                    placeholder="Adicione qualquer observação adicional relevante..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none transition-all duration-200"
                    rows={4}
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column - Preview Section */}
          <div className="lg:sticky lg:top-8 lg:self-start">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <FileText className="w-5 h-5 mr-2 text-orange-500" />
                      Preview do Checklist
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">Visualização em tempo real do seu checklist</p>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={copyToClipboard}
                    className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-sm hover:shadow-md ${
                      copySuccess 
                        ? 'bg-green-500 hover:bg-green-600' 
                        : 'bg-orange-500 hover:bg-orange-600'
                    }`}
                  >
                    {copySuccess ? (
                      <>
                        <CheckSquare className="w-4 h-4 mr-2" />
                        Copiado!
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={downloadChecklist}
                    className="inline-flex items-center px-4 py-2 border border-orange-300 text-sm font-medium rounded-lg text-orange-700 bg-white hover:bg-orange-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Baixar MD
                  </button>
                </div>
              </div>
              <div className="p-6">
                <div className="max-h-[70vh] overflow-y-auto">
                  <pre className="text-sm text-gray-700 whitespace-pre-wrap font-mono bg-gray-50 p-4 rounded-lg">
                    {generateChecklistText()}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;