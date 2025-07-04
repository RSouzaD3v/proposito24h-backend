# Checklist: Implementação do Módulo de Escritores

## 📌 1. Atualização do Banco de Dados

### 1.1 Schema do Prisma
- [x] *Adicionar campos ao modelo User*
  - [x] website: String?
  - [x] socialMedia: Json?
  - [x] bankDetails: Json?
  - [x] paymentDetails: Json?
  - [x] documents: Json?
  - [x] customDomain: String?
  - [x] isVerified: Boolean @default(false)
  - [x] commissionRate: Float?
  - [x] verificationStatus: VerificationStatus @default(PENDING)

### 1.2 Índices e Otimizações
- [ ] Adicionar índices para campos de busca
- [ ] Configurar paginação padrão
- [ ] Otimizar consultas frequentes

### 1.3 Migração
- [x] Criar migração
- [x] Rodar migração em desenvolvimento
- [ ] Testar rollback

## 📌 2. Backend

### 2.1 Módulo de Escritores
- [ ] *Enums Adicionais*
  - [ ] VerificationStatus (PENDING, APPROVED, REJECTED)
  - [ ] DocumentType (CPF, RG, PROOF_OF_ADDRESS)

### 2.2 DTOs e Validações
- [ ] *DTOs*
  - [ ] CreateWriterDto
  - [ ] UpdateWriterDto
  - [ ] WriterResponseDto
  - [ ] UploadDocumentDto
  - [ ] VerifyWriterDto

- [ ] *Serviços*
  - [ ] Validação de documentos
  - [ ] Verificação em duas etapas
  - [x] Notificações por e-mail
  - [x] WriterService com CRUD
  - [ ] Validação de domínios
  - [ ] Cálculo de comissões

- [ ] *Controladores*
  - [x] CRUD de escritores
  - [ ] Upload de documentos
  - [ ] Verificação de identidade
  - [ ] Aprovação/Rejeição de cadastro
  - [ ] Revisão de documentos

### 2.2 Rotas

- [x]GET    /api/admin/writers           # Listar escritores
- [x] POST   /api/admin/writers           # Criar escritor
- [x] GET    /api/admin/writers/:id       # Detalhes do escritor
- [x] PUT    /api/admin/writers/:id       # Atualizar escritor
- [x] DELETE /api/admin/writers/:id       # Inativar escritor
- [x] GET    /api/writers/me              # Meu perfil de escritor
- [x] PUT    /api/writers/me              # Atualizar meu perfil
- [x] GET    /api/writers/me/metrics      # Minhas métricas


## 📌 3. Segurança

### 3.1 Autenticação
- [ ] 2FA para aprovação de escritores
- [ ] Registro de atividades suspeitas
- [ ] Limite de tentativas de upload

### 3.2 Permissões
- [x] Controle de acesso baseado em papéis
- [x] Validação de permissões em endpoints
- [x] Logs de auditoria

## 📌 4. Frontend Admin

### 3.1 Lista de Escritores
- [x] Tabela com ordenação
- [ ] Filtros por status/verificação
- [x] Busca por nome/e-mail

### 3.2 Formulário de Escritor
- [ ] Aba de Informações Básicas
- [ ] Aba de Dados Bancários
- [ ] Aba de Configurações
- [ ] Upload de documentos

### 3.3 Dashboard de Métricas
- [ ] Gráfico de vendas
- [ ] Métricas de engajamento
- [ ] Exportação de relatórios

## 📌 5. Fluxo de Aprovação

### 4.1 Cadastro
1. Usuário se cadastra como escritor
2. Preenche informações adicionais
3. Envia documentos
4. Sistema notifica admin

### 4.2 Aprovação
1. Admin revisa documentos
2. Aprova/rejeita cadastro
3. Sistema notifica usuário
4. Libera acesso ao painel

## 📌 6. Testes

### 5.1 Backend
- [ ] Testes unitários
- [ ] Testes de integração
- [ ] Testes de validação

### 5.2 Frontend
- [ ] Testes de componentes
- [ ] Testes de fluxo
- [ ] Testes E2E

## 📅 Cronograma Revisado

### Dia 1: Banco de Dados e Segurança
- Atualizar schema e migrações
- Implementar autenticação 2FA
- Configurar logs de auditoria

### Dia 2: Backend Core
- Serviços de escritores
- Upload e validação de documentos
- Sistema de notificações

### Dia 3: Frontend Admin
- Lista de escritores com filtros
- Formulário de verificação
- Dashboard de aprovação

### Dia 4: Testes e Ajustes
- Testes de segurança
- Testes de carga
- Ajustes de performance

### Dia 1: Banco de Dados e Backend Básico
- Atualizar schema
- Implementar serviços básicos
- Criar endpoints principais

### Dia 2: Frontend Admin
- Lista de escritores
- Formulário de edição
- Upload de documentos

### Dia 3: Dashboard e Métricas
- Gráficos de desempenho
- Relatórios
- Exportação de dados

### Dia 4: Testes e Ajustes
- Testes automatizados
- Ajustes de performance
- Revisão de segurança

## 🔍 Próximos Passos
1. Revisar checklist com a equipe
2. Iniciar pelo banco de dados
3. Desenvolver backend
4. Implementar frontend
5. Testar e ajustar