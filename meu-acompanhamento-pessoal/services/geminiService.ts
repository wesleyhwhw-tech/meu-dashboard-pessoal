
import { GoogleGenAI, Type } from "@google/genai";
import { type Transaction, type Bet, type Product } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const generateContent = async (prompt: string, config?: any): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            ...config,
        });
        return response.text ?? "Não foi possível gerar uma resposta.";
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        return "Ocorreu um erro ao comunicar com a API do Gemini. Verifique o console para mais detalhes.";
    }
};


export const generateFinancialInsights = (transactions: Transaction[]): Promise<string> => {
  const prompt = `
    Analise os seguintes dados de transações financeiras e forneça insights acionáveis em português.
    Foco em:
    1.  Principais categorias de despesas.
    2.  Comparação entre receitas e despesas.
    3.  Sugestões para economia ou otimização de gastos.
    4.  Resumo geral da saúde financeira no período.
    
    Formate a resposta em markdown.

    Dados:
    ${JSON.stringify(transactions, null, 2)}
  `;
  return generateContent(prompt);
};

export const generateBettingInsights = (bets: Bet[]): Promise<string> => {
  const prompt = `
    Analise os seguintes dados de apostas esportivas e forneça uma análise de desempenho em português.
    Foco em:
    1.  Cálculo do ROI (Return on Investment).
    2.  Análise de lucros e perdas.
    3.  Identificação de padrões (e.g., odds que mais dão retorno, tipos de aposta mais lucrativos).
    4.  Sugestões para melhorar a estratégia de apostas.

    Formate a resposta em markdown.

    Dados:
    ${JSON.stringify(bets, null, 2)}
  `;
  return generateContent(prompt);
};


export const checkBetResult = async (bet: Bet): Promise<{result: 'won' | 'lost' | 'pending', profit: number}> => {
    const prompt = `
        Com base nos resultados oficiais de eventos esportivos, determine o resultado da seguinte aposta:
        - Descrição da Aposta: "${bet.description}"
        - Data do Evento: ${bet.date}

        Qual foi o resultado da aposta? Responda APENAS com "won" se a aposta foi ganha, ou "lost" se a aposta foi perdida. Se não for possível determinar, responda "pending".
    `;
    const resultText = await generateContent(prompt, { config: { tools: [{googleSearch: {}}] } });
    const result = resultText.trim().toLowerCase();

    if (result === 'won' || result === 'lost') {
        let profit = 0;
        if (result === 'won') {
            profit = bet.stake * bet.odds - bet.stake;
        } else {
            profit = -bet.stake;
        }
        return { result, profit };
    }
    
    return { result: 'pending', profit: 0 };
};

export const fetchUpcomingMatches = (date: string): Promise<string> => {
    const prompt = `Usando a busca, liste os principais jogos de futebol do dia "${date}".
    Responda APENAS com um objeto JSON. O JSON deve ser um array de objetos, onde cada objeto tem as chaves "match" (ex: "Time A vs Time B") e "date" (que deve ser "${date}").
    Se não houver jogos importantes, retorne um array vazio [].
    Não inclua nenhuma formatação ou texto adicional antes ou depois do JSON.`;

    return generateContent(prompt, {
        config: {
            tools: [{googleSearch: {}}]
        }
    });
};

export const generateGameAnalysis = (match: string): Promise<string> => {
    const prompt = `Usando a busca, gere uma pré-análise detalhada para o jogo de futebol "${match}".
    Responda APENAS com um objeto JSON com as seguintes chaves:
    - "analysis": um parágrafo com a análise do momento atual das equipes e ponto chave.
    - "potentialEntries": uma sugestão curta de mercado para ficar de olho.
    - "referee": o nome do árbitro da partida (retorne "Não encontrado" se não achar).
    - "cardStats": a média de cartões do árbitro ou dos times (ex: "Média de 5.2 cartões").
    - "cornerScenario": um breve texto sobre o cenário esperado para escanteios.
    - "teamCornerAverages": as médias de escanteios dos times (ex: "Casa: 6.5 / Fora: 4.8").
    Não inclua nenhuma formatação ou texto adicional antes ou depois do JSON.`;
    
    return generateContent(prompt, {
        config: {
            tools: [{googleSearch: {}}]
        }
    });
};

export const parseEventFromText = (text: string): Promise<string> => {
    const prompt = `Extraia os detalhes do evento do seguinte texto: "${text}".
    Considere que a data de hoje é ${new Date().toLocaleDateString('pt-BR')}.
    Interprete datas relativas como "amanhã", "próxima sexta-feira", etc.
    Retorne APENAS um objeto JSON.`;

    return generateContent(prompt, {
        config: {
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "O título do evento." },
                    date: { type: Type.STRING, description: "A data do evento no formato AAAA-MM-DD." },
                    time: { type: Type.STRING, description: "A hora do evento no formato HH:MM (24h)." }
                },
                required: ["title", "date", "time"]
            }
        }
    });
};

export const generateSalesScript = (product: Product): Promise<string> => {
    const prompt = `
        Crie um roteiro de vendas (pitch de vendas) curto e persuasivo em português para o seguinte produto:
        - Nome do Produto: ${product.name}
        - Descrição: ${product.description}
        - Preço: ${product.price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}

        O roteiro deve:
        1.  Começar com uma saudação e uma pergunta de engajamento.
        2.  Apresentar o produto e seu principal benefício.
        3.  Criar um senso de urgência ou valor.
        4.  Terminar com uma chamada para ação clara (call to action).

        Formate a resposta em markdown, com títulos para cada seção do script.
    `;
    return generateContent(prompt);
};
