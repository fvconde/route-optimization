# Relatório Técnico: Otimização de Rotas Hospitalares com Algoritmos Genéticos e LLMs

## 1. Introdução

O presente projeto tem como foco a resolução de um problema de roteamento logístico aplicado a um cenário crítico: a distribuição hospitalar. A logística hospitalar demanda não apenas minimizar a distância percorrida pela frota, mas garantir rigorosamente o cumprimento de Janelas de Tempo (SLA) para entregas urgentes, garantindo a integridade de insumos críticos.

O objetivo deste projeto foi o desenvolvimento de um sistema completo que utiliza um **Algoritmo Genético (GA)** para resolver variantes complexas do **Problema do Caixeiro Viajante (TSP)** e **Problema de Roteamento de Veículos (VRP)**, aplicando restrições operacionais rígidas do mundo real.

Como motivação principal, busca-se demonstrar que a união de meta-heurísticas de otimização, com um frontend interativo em tempo real e a inserção de Inteligência Artificial baseada em LLMs (Large Language Models) para sumarização, resulta em um sistema de apoio à decisão tático-operacional altamente eficiente e centrado no usuário.

---

## 2. Fundamentação Teórica

O desafio de traçar o melhor caminho que passe por uma série de pontos exatamente uma vez e retorne à origem é conhecido como o **Problema do Caixeiro Viajante (TSP)**. Como é classificado como NP-Difícil, abordagens exatas se tornam inviáveis para muitas localidades devido à explosão combinatória.

Para solucionar tal entrave, aplicamos **Algoritmos Genéticos (GA)**, simulando a evolução natural:
* **Representação**: Cada cromossomo (indivíduo) é representado por um array (lista) ordenado de índices de clientes (ex: `[1, 5, 2, 4, 3]`).
* **Seleção**: Utiliza-se um torneio competitivo focado em preservar na população as rotas que apresentam os menores traçados e penalidades.
* **Crossover**: Cruzamento onde se seleciona uma sub-rota aleatória do "Pai 1" e os pontos restantes, mantendo a ordem sequencial, são extraídos do "Pai 2".
* **Mutação**: Baseada na troca de posições (swap) aleatórias de dois locais da rota, mantendo uma taxa de mutação (ex: 10%) para introduzir variabilidade e escapar de ótimos locais.

No contexto atual, adicionamos **LLMs (Large Language Models)** para transpor a frieza dos números produzidos pela Inteligência Artificial simbólica (GA). O LLM atua interpretando a performance final (distância, tempo estimado, contagem de veículos) produzindo conselhos operacionais e relatórios gerenciais em formato de linguagem natural facilmente assimilável.

---

## 3. Arquitetura da Solução

O sistema possui arquitetura moderna composta por:

* **Backend (FastAPI - Python)**: Responsável pelo motor matemático (`ga/`), cálculo de distâncias (`tsp/`), avaliação rigorosa de infrações de negócios (`constraints/`) e integração com LLM (`services/`).
* **Frontend (Angular)**: Módulos de interface de usuário (Dashboard) altamente interativos (`config-panel`, `results-panel`, `map`, `chart`), permitindo aos usuários imputarem parâmetros de negócios (gerações, número de veículos, pontos) e acompanharem a elaboração das rotas graficamente.
* **Integração com LLM**: Acoplado ao backend através da API oficial da plataforma Google Generative AI (Gemini Flash).

### Diagrama Funcional:

```text
Frontend → API (FastAPI) → GA (Evolução) → Constraints (Penalidades/Rejeição) → LLM (Geração de Insights)
```

---

## 4. Implementação

### 4.1 Algoritmo Genético

A execução (`ga/__init__.py`) inicia gerando uma população padrão composta por 80 rotas (indivíduos) elaborados de maneira inteiramente aleatória. A evolução natural continua por uma quantidade estipulada de gerações. Ao final, a melhor cadeia é repartida caso seja solicitada a implantação de "Múltiplos Veículos" usando divisões balanceadas do array (via `np.array_split`).

A premissa da avaliação se apoia na **Função Fitness**. O foco não é apenas calcular a distância pura intra-rota (somatória geométrica do TSP via `math.hypot`), mas agregar as penalidades de negócios de foma linear:

`Fitness = Distância Total + Penalidade (Tempo) + Penalidade (Prioridades)`

### 4.2 Restrições Aplicadas

A lógica de restrições implementada exibe robustez técnica em classificar e punir cadeias inviáveis (`constraints/__init__.py`). Duas macro-verificações são executadas:

1. **Prioridade por Índice (`priority_penalty`)**:
   Locais classificados com urgência precisam obrigatoriamente aparecer nos primórdios da rota montada.
   * Prioridade 3 (Urgente): Se a parada exceder a posição 3 no arranjo do veículo, há punição direta de `+1000`.
   * Prioridade 2 (Alta): Se estiver alocado sucessivamente após o 6º cliente fechador, recai uma punição de `+500`.

2. **Janelas de Tempo / SLA e Horário Comercial (`time_penalty`)**:
   Tendo a premissa de que os deslocamentos se baseiam em velocidade de 60 km/h e partidas as 8:00h da manhã:
   * Pontos urgentes têm limite de espera máximo até 10:00h da manhã, punindo caso viole (`+2000`).
   * Pontos de prioridade alta possuem SLA até meio-dia (12:00h), atraindo punição se quebrado (`+1000`).
   * Prioridades normais têm SLA até as 16:00h (`+300`).
   * A restrição do horizonte global estipula expediente até as 18:00h (punições superlativas de `+5000` caso a rota ultrapasse os limites comerciais).

Ao penalizar pesadamente a função custo (Fitness) em caso de quebra contratual, o algoritmo genético "aprende" geracionalmente a expulsar rotas não-compliance, validando restrições de tempo restritivas e cenários **VRP** complexos.

### 4.3 Integração com LLM

Após a concepção das rotas e apuração do histórico de evolução da Fitness, foi projetado no pacote Python uma consulta remota aos modelos do *Gemini* (modelo `gemini-2.5-flash`), localizado em `llm_service.py`. A injeção de prompt instrui explicitamente a IA a comportar-se como "Assistente Logístico Hospitalar". Transcrevem-se dados diretos (Distâncias Finais, Tempos Brutos e Quantidade de Frotas/Rotas geradas), solicitando a síntese executiva.

**Exemplo de Prompt / Entrada (Simplificado)**:
```text
Contexto: Você é um assistente logístico hospitalar.
Avalie: Distância total: 843.5, Tempo estimado: 14.1 horas, Rotas ativas: 2...
Considere SLA de prioridades urgente e eficiência logística...
```

**Exemplo de Saída Esperada**: O modelo responde elaborando parágrafos contendo um resumo analítico situacional de se as rotas formadas parecem sustentáveis para o turno vigente frente aos insumos de alta criticidade e sugerindo melhorias em rotas ou ajustes do total de frotas. 

---

## 5. Experimentos e Resultados

### 5.1 Evolução do Algoritmo

A interface conta com um gráfico analítico rastreando a série histórica (array `history` retornado na API). Esse gráfico atesta perfeitamente o comportamento meta-heurístico esperado: nas primérias etapas da evolução, os saltos de decréscimo na Função Fitness são expressivos (devido fundamentalmente ao expurgo de rotas repletas de alta penalidade/inviáveis logísticamente). Próximo às 50~80 gerações a curva estabiliza-se, evidenciando ótima convergência onde apenas flutuações métricas distritais ou locais ocorrem minimamente.

### 5.2 Comparação de Algoritmos

Executando o simulador central com a suite completa (*Dashboard > Experiments Panel*), confrontou-se:
1. **Aleatório pura**: Valores estratosféricos devido a choques ininterruptos de restrições rigorosas.
2. **Heurística Gulosa (Nearest Neighbor)**: Excelente e ágil para minimizar a distância simples, porém cega contratualmente falhando esporadicamente nas checagens restritivas globais do hospital. 
3. **Algoritmo Genético**: O equilíbrio magistral. Embora sacrifique ligeiros centésimos na distância métrica comparado a rotas livres, o GA absorve perfeitamente penalizadores de tempo, sendo a única que gerou escalonamento priorizado limpo garantindo que clínicas críticas sejam servidas primeiro.

### 5.3 Experimentos (Sensibilidade)
Modificar a configuração expôs limites:
* **Muitas Gerações (ex: 200+)**: Entrega refinamentos milimétricos, mas o overhead de resposta na API em *real-time* degrada a experiência primária (UX).
* **Restrições de Frota**: Testes rodados restringindo para um único veículo e alta dispersão geográfica de amostras estouraram invencivelmente penalizações temporais, recomendando-se (e ratificado pelo LLM) despachar no mínimo 2 a 3 viaturas no cluster.

---

## 6. Análise Crítica

A implementação do algoritmo evolutivo combinada com APIs performáticas gerou grande robustez na alocação de cargas críticas.
**O que funcionou bem**:
* A conversão das restrições de horários, SLAs e posições em multas numéricas de escalão distinto adaptou primorosamente o problema restrito à metodologia heurística clássica, viabilizando rotas altamente exequíveis.
* O acoplamento do LLM adiciona valor incomensurável transformando métricas difusas em insights acionáveis imediatos para despachantes operacionais e diretores de planta.

**Limitações Atuais**:
* A divisão de "Múltiplos Veículos" presente atualmente opera sob segmentações básicas (`np.array_split`), o que pode forçar arranjos onde veículos encareçam suas quilometragens sem roteamento avançado intra-frota (Multi-Depot VRP / Capacitated VRP).
* O GA nativo ainda é suscetível a convergir prematuramente devido aos "muros" rígidos de penalidades.

**Possíveis Melhorias**:
* Implantação de Algoritmos Meméticos, unindo GA a otimizadores Locais focados espacialmente (*2-opt, 3-opt*) que poliriam gargalos cruzados.
* Considerar as capacidades dos veículos nas restrições (`peso` e `volume`), fator capital em suprimentos hospitalares logísticos complexos. 

---

## 7. Conclusão

O escopo do projeto atendeu exitosamente às proposições. Ao final da esteira, foi materializado um framework completo, performático e funcional capaz de ler um espectro conturbado de nós topográficos, decodificar as diretrizes vitais do negócio e resolver uma situação intocável para resoluções manuais simplistas. A contribuição da adoção da IA generativa do **LLM** solidifica uma roupagem de acessibilidade não vista usualmente em protótipos acadêmicos abstratos. Este projeto apresenta altíssima aplicabilidade na realidade do transbordo médico, coleta de exames laboratoriais, e home-care, servindo como embasamento conciso para o escalonamento em nível de produção. 

---

## 8. Referências

1. HOLLAND, John H. *Adaptation in natural and artificial systems: an introductory analysis with applications to biology, control, and artificial intelligence*. MIT press, 1992.
2. DANTZIG, G., FULKERSON, R., JOHNSON, S. M. *Solution of a large-scale traveling-salesman problem*. Journal of the operations research society of America, 1954.
3. FastAPI Documentation: https://fastapi.tiangolo.com/
4. Documentação de API Generative AI LLC (O modelo Gemini): https://ai.google.dev/docs
