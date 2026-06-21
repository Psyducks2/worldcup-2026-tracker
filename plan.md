**Spec Doc / Documento de Especificação do Projeto**  
**Projeto:** World Cup 2026 Tracker (Acompanhamento da Copa do Mundo 2026)

### 1. Melhor Linguagem e Framework

**Recomendação Principal (Melhor custo-benefício para portfólio em 2026):**

- **Linguagem:** **TypeScript** (em vez de JavaScript puro)
- **Framework:** **Next.js 15 (App Router)**

#### Porquê esta stack?

| Critério                    | Next.js + TypeScript                          | Alternativas (menos recomendadas)          |
|----------------------------|-----------------------------------------------|--------------------------------------------|
| Velocidade de desenvolvimento | Excelente (SSR, SSG, API Routes)             | React CRA / Vite puro                      |
| SEO + Performance          | Ótimo (Server Components, Streaming)         | SvelteKit (bom, mas ecossistema menor)    |
| Hospedagem Vercel          | Experiência nativa e zero-config             | Qualquer outro (mais configuração)         |
| Integração com APIs        | Fetch nativo + caching automático (fetch cache, revalidate) | - |
| Visualizações e UI         | Fácil com Tailwind + shadcn/ui + Recharts    | - |
| Escalabilidade             | Edge Functions, ISR, Route Handlers          | - |
| Portfólio                  | Muito valorizado no mercado                  | - |

**Estrutura sugerida do projeto:**
- `app/` → App Router (páginas, layouts)
- `components/` → Tabelas, Bracket, Cards
- `lib/` → API utils, simulador de probabilidades
- `types/` → TypeScript interfaces para dados da Copa
- API Routes ou Route Handlers para cache e cálculos pesados (probabilidades)

**Alternativa mais simples (se quiser algo ultra-rápido):**  
Vite + React + TypeScript (sem Next.js). Mas perde muitas vantagens da Vercel.

### 2. Como Hospedar na Vercel

A Vercel é **a melhor opção** para este projeto (gratuita no Hobby tier para a maioria dos casos).

#### Passo a passo:

1. **Crie o projeto localmente**
   ```bash
   npx create-next-app@latest worldcup-2026-tracker --typescript --tailwind --eslint --app
   cd worldcup-2026-tracker
   ```

2. **Faça commit e suba para o GitHub**
   - Crie um repositório público no GitHub.

3. **Deploy na Vercel**
   - Acesse [vercel.com](https://vercel.com)
   - Clique em **New Project** → Importe o repo do GitHub
   - Configure (quase nada necessário):
     - Framework Preset: **Next.js**
     - Root Directory: `./`
   - Clique em **Deploy**

4. **Configurações importantes**
   - **Environment Variables**: Adicione suas chaves de API (ex: `API_FOOTBALL_KEY`)
   - **Custom Domain** (opcional): Ligue um domínio próprio depois.
   - **Preview Deployments**: Toda branch/PR gera um preview automático (ótimo para mostrar evolução).
   - **ISR / Revalidation**: Use `revalidate` nos fetches para atualizar standings automaticamente.

**Dica para performance:**
- Use `fetch` com `{ next: { revalidate: 60 } }` para dados que mudam a cada minuto.
- Para live scores → polling leve ou Server-Sent Events.

Após o deploy, terá um link tipo: `https://worldcup-2026-tracker.vercel.app`

### 3. Como Receber Informações da API da FIFA

**FIFA não tem API pública oficial gratuita** para developers. Temos que usar provedores terceiros.

#### Melhores opções para 2026 (atualizado):

| API                          | Preço                  | Vantagens                              | Recomendado para |
|-----------------------------|------------------------|----------------------------------------|------------------|
| **rezarahiminia/worldcup2026** (GitHub) | **100% Grátis** | Live scores, grupos, fixtures, sem key | MVP inicial |
| **football-data.org**       | Free tier             | Boa para standings e fixtures         | Protótipo |
| **API-Football** (API-Sports) | Free (limitado) + pago | Excelente cobertura WC 2026           | Produção |
| **BallDontLie FIFA API**    | Free tier + pago      | Dados detalhados 2026                 | Boa alternativa |
| Sportmonks / TheStatsAPI    | Pago (~50-70€/mês)    | Mais completa (xG, odds, etc.)        | Depois do MVP |

**Recomendação inicial (para portfólio):**

1. Comece com a **API gratuita open-source**:  
   Base URL: `https://worldcup26.ir/api` (ou o endpoint oficial do repo)  
   Documentação Swagger disponível.

2. Para dados mais ricos → Registre na **API-Football** (tem guia específico para World Cup 2026).

#### Exemplo de como consumir no Next.js (TypeScript)

```ts
// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://worldcup26.ir/api';

export async function getGroupStandings(group?: string) {
  const res = await fetch(`${BASE_URL}/standings${group ? `?group=${group}` : ''}`, {
    next: { revalidate: 300 }, // 5 minutos
  });
  return res.json();
}

export async function getFixtures() {
  const res = await fetch(`${BASE_URL}/fixtures`, {
    next: { revalidate: 60 },
  });
  return res.json();
}
```

Depois use em Server Components ou Route Handlers.

**Para Probabilidades (seu diferencial):**
- Busque standings + fixtures restantes.
- Implemente uma simulação Monte Carlo simples em um Route Handler (Node.js).
- Ou use dados de odds de alguma API.