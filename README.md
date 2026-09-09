**FASE 1: Arquitetura & Fluxo Consolidado**

O FrameFlow adota o padrão de API Agregada (Anti-Chatty) combinada com persistência atômica e disparo determinístico via Deep Link (wa.me), viabilizando operação custo zero sem servidores de webhook 24/7 para o cliente final.

![Diagrama de Sequência](docs/diagrams/sequence.svg)

<details open>
<summary><b>Código Mermaid</b></summary>

```mermaid
sequenceDiagram
    autonumber
    actor C as Cliente / Noivo(a)
    actor V as Videomaker (Admin)
    participant FE as Vue 3 SPA (Vercel)
    participant API as Fastify/Node.js API (Render/Railway Free)
    participant DB as PostgreSQL (Neon.tech Free Tier)
    participant WA as WhatsApp Client (wa.me)

    %% Fluxo Público: Simulação e Criação de Proposta
    rect rgb(240, 248, 255)
    note right of C: Fluxo de Conversão e Proposta (Público)
    C->>FE: Seleciona Pacote, Adicionais e Data do Evento
    FE->>API: POST /api/v1/proposals (Composite Mutation Payload)
    activate API
    API->>DB: QueryRunner Transaction (Proposal + Items + Lead)
    DB-->>API: Commit OK (Proposal ID & Hash gerados)
    API-->>FE: HTTP 201 { proposal, whatsapp_direct_url }
    deactivate API
    FE->>WA: Redireciona via window.open(whatsapp_direct_url)
    WA->>V: Mensagem formatada enviada com ID de rastreio
    end

    %% Fluxo Administrativo: Bootstrap Único
    rect rgb(245, 255, 245)
    note right of V: Painel Administrativo (Autenticado)
    V->>FE: Acessa /dashboard
    FE->>API: GET /api/v1/dashboard/bootstrap (Bearer Token)
    activate API
    API->>DB: QueryBuilder (Aggregated Metrics + Scheduled Events + Proposals)
    DB-->>API: ResultSet indexado sem N+1
    API-->>FE: HTTP 200 { user, metrics, agenda, recent_proposals }
    deactivate API
    FE-->>V: Interface hidratada em Single Round-Trip
    end
```
</details>