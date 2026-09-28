export type UserRole = 'admin' | 'gestao' | 'comercial' | 'projetos' | 'financeiro' | 'colaborador' | 'leitura';

export type User = {
  id: string;
  name: string;
  email: string;
  cargo?: string;
  area?: string;
  role: UserRole;
  active: boolean;
  created_at: string;
  avatar_url?: string;
};

export type ClientClassification = 'ativo' | 'inativo' | 'prospect' | 'parceiro_cliente' | 'fornecedor_cliente' | 'estrategico';

export type Client = {
  id: string;
  name: string;
  fantasy_name: string;
  document: string;
  email: string;
  phone: string;
  whatsapp?: string;
  address: string;
  city?: string;
  state?: string;
  country?: string;
  site?: string;
  segment?: string;
  classification: ClientClassification;
  responsible_id?: string;
  origin?: string;
  first_contact?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type ContactType = 'decisor' | 'influenciador' | 'tecnico' | 'financeiro' | 'juridico' | 'compras' | 'administrativo' | 'usuario_final';

export type Contact = {
  id: string;
  client_id: string;
  name: string;
  cargo?: string;
  area?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  linkedin?: string;
  contact_type: ContactType;
  decision_influence?: string;
  notes?: string;
  created_at: string;
};

export type LeadOrigin = 'site' | 'indicacao' | 'evento' | 'congresso' | 'rede_social' | 'prospeccao_ativa' | 'parceiro' | 'cliente_existente' | 'contato_pessoal' | 'fornecedor' | 'outro';
export type LeadStatus = 'novo' | 'nao_contatado' | 'tentativa_contato' | 'contatado' | 'qualificacao' | 'qualificado' | 'nao_qualificado' | 'convertido' | 'arquivado';
export type LeadTemperature = 'frio' | 'morno' | 'quente';

export type Lead = {
  id: string;
  name: string;
  company?: string;
  cargo?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  state?: string;
  country?: string;
  origin: LeadOrigin;
  origin_detail?: string;
  interest_area?: string;
  probable_service?: string;
  demand_description?: string;
  urgency?: string;
  informed_budget?: number;
  informed_deadline?: string;
  responsible_id?: string;
  status: LeadStatus;
  temperature: LeadTemperature;
  entry_date: string;
  last_interaction?: string;
  next_action?: string;
  next_action_date?: string;
  created_at: string;
  updated_at?: string;
};

export type OpportunityStage = 'lead_identificado' | 'contato_realizado' | 'diagnostico' | 'escopo_definicao' | 'orcamento_interno' | 'proposta_elaboracao' | 'proposta_enviada' | 'negociacao' | 'aprovacao_verbal' | 'contrato' | 'ganho' | 'perdido' | 'suspenso';
export type LossReason = 'preco' | 'concorrente' | 'falta_orcamento' | 'prazo' | 'cliente_desistiu' | 'escopo_incompativel' | 'sem_resposta' | 'projeto_cancelado' | 'decisao_interna' | 'outro';

export type Opportunity = {
  id: string;
  code: string;
  title: string;
  client_id: string;
  contact_id?: string;
  responsible_id: string;
  origin?: LeadOrigin;
  service?: string;
  description?: string;
  stage: OpportunityStage;
  estimated_value?: number;
  probability?: number;
  expected_close_date?: string;
  next_action?: string;
  next_action_date?: string;
  commercial_classification?: string;
  partner_id?: string;
  loss_reason?: LossReason;
  loss_detail?: string;
  created_at: string;
  updated_at?: string;
};

export type ActivityType = 'ligacao' | 'whatsapp' | 'email' | 'reuniao' | 'visita' | 'proposta' | 'mensagem' | 'contato_parceiro' | 'observacao';

export type OpportunityActivity = {
  id: string;
  opportunity_id: string;
  type: ActivityType;
  date: string;
  user_id: string;
  description: string;
  result?: string;
  attachment_url?: string;
  next_action?: string;
  next_action_deadline?: string;
  created_at: string;
};

export type ProposalStatus = 'rascunho' | 'revisao_interna' | 'aguardando_aprovacao' | 'aprovada_internamente' | 'enviada' | 'em_negociacao' | 'revisao_solicitada' | 'aceita' | 'recusada' | 'expirada' | 'cancelada';

export type Proposal = {
  id: string;
  number: string;
  client_id: string;
  opportunity_id?: string;
  responsible_id: string;
  version: number;
  date: string;
  validity_date?: string;
  scope?: string;
  deliverables?: string;
  deadline?: string;
  value?: number;
  taxes?: number;
  costs?: number;
  margin?: number;
  payment_conditions?: string;
  status: ProposalStatus;
  document_url?: string;
  created_at: string;
  updated_at?: string;
};

export type ProposalVersion = {
  id: string;
  proposal_id: string;
  version: number;
  author_id: string;
  date: string;
  change_reason?: string;
  previous_value?: number;
  new_value?: number;
  changes_description?: string;
  document_url?: string;
};

export type ProjectStatus = 'preparacao' | 'planejamento' | 'em_andamento' | 'aguardando_cliente' | 'aguardando_fornecedor' | 'aguardando_parceiro' | 'em_revisao' | 'aguardando_aprovacao' | 'suspenso' | 'concluido' | 'cancelado';
export type ProjectPriority = 'baixa' | 'normal' | 'alta' | 'urgente' | 'critica';

export type Project = {
  id: string;
  code: string;
  title: string;
  client_id: string;
  opportunity_id?: string;
  responsible_id: string;
  team_ids?: string[];
  partner_id?: string;
  service?: string;
  description?: string;
  scope?: string;
  start_date?: string;
  expected_end_date?: string;
  actual_end_date?: string;
  priority: ProjectPriority;
  status: ProjectStatus;
  financial_status?: string;
  contracted_value?: number;
  contract_id?: string;
  proposal_id?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type ProjectMember = {
  id: string;
  project_id: string;
  user_id: string;
  role?: string;
  joined_at: string;
};

export type TaskStatus = 'nao_iniciada' | 'planejada' | 'em_andamento' | 'aguardando_cliente' | 'aguardando_fornecedor' | 'aguardando_equipe' | 'bloqueada' | 'em_revisao' | 'concluida' | 'cancelada';

export type TaskChecklistItem = {
  id: string;
  text: string;
  completed: boolean;
  completed_at?: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  project_id?: string;
  opportunity_id?: string;
  client_id?: string;
  responsible_id: string;
  participants?: string[];
  priority: ProjectPriority;
  status: TaskStatus;
  start_date?: string;
  deadline?: string;
  completed_at?: string;
  dependency_id?: string;
  blocked_by?: string;
  attachments?: string[];
  checklist?: TaskChecklistItem[];
  created_at: string;
  updated_at?: string;
};

export type TaskDependency = {
  id: string;
  task_id: string;
  depends_on_task_id: string;
  type: 'blocks' | 'starts_after';
};

export type Meeting = {
  id: string;
  title: string;
  client_id?: string;
  project_id?: string;
  opportunity_id?: string;
  participants?: string[];
  date: string;
  time?: string;
  location_or_link?: string;
  agenda?: string;
  responsible_id: string;
  minutes?: string;
  decisions?: string[];
  pending_items?: string[];
  next_meeting_date?: string;
  created_at: string;
};

export type MeetingDecision = {
  id: string;
  meeting_id: string;
  decision: string;
  responsible_id?: string;
  deadline?: string;
};

export type Supplier = {
  id: string;
  legal_name: string;
  name: string;
  document?: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  category?: string;
  services?: string;
  average_deadline?: string;
  conditions?: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
  deleted_at?: string;
};

export type SupplierQuote = {
  id: string;
  supplier_id: string;
  project_id?: string;
  scope?: string;
  value?: number;
  validity_date?: string;
  deadline?: string;
  document_url?: string;
  approved?: boolean;
  approved_by?: string;
  responsible_id: string;
  created_at: string;
};

export type Partner = {
  id: string;
  company_name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  partnership_type?: string;
  areas?: string;
  commercial_rules?: string;
  percentage?: number;
  contract_url?: string;
  validity_start?: string;
  validity_end?: string;
  created_at: string;
  updated_at?: string;
};

export type ParticipationType = 'indicacao' | 'participacao_comercial' | 'execucao_projeto';
export type LeadOriginCompany = 'vivens' | 'biotec' | 'compartilhado' | 'terceiro' | 'cliente_recorrente';

export type CommercialParticipation = {
  id: string;
  opportunity_id?: string;
  project_id?: string;
  type: ParticipationType;
  lead_origin_company: LeadOriginCompany;
  prospecting_responsible?: string;
  commercial_responsible?: string;
  executing_company?: string;
  vivens_participation?: number;
  biotec_participation?: number;
  commission_percentage?: number;
  commission_value?: number;
  calculation_base?: number;
  payment_date?: string;
  status?: string;
  notes?: string;
  created_at: string;
};

export type CommissionStatus = 'prevista' | 'aprovada' | 'faturavel' | 'a_receber' | 'recebida' | 'cancelada';

export type Commission = {
  id: string;
  opportunity_id?: string;
  project_id?: string;
  beneficiary?: string;
  type?: string;
  percentage?: number;
  value?: number;
  base?: number;
  condition?: string;
  due_date?: string;
  payment_date?: string;
  receipt_url?: string;
  status: CommissionStatus;
  created_at: string;
};

export type Contract = {
  id: string;
  number?: string;
  client_id: string;
  project_id?: string;
  type?: string;
  start_date?: string;
  end_date?: string;
  value?: number;
  responsible_id?: string;
  document_url?: string;
  status: string;
  created_at: string;
  updated_at?: string;
};

export type RevenueStatus = 'previsto' | 'faturado' | 'a_receber' | 'recebido' | 'vencido' | 'renegociado' | 'cancelado';

export type Revenue = {
  id: string;
  project_id: string;
  client_id?: string;
  installment?: number;
  document_number?: string;
  value: number;
  due_date?: string;
  received_date?: string;
  status: RevenueStatus;
  notes?: string;
  created_at: string;
};

export type Expense = {
  id: string;
  project_id?: string;
  supplier_id?: string;
  category?: string;
  description?: string;
  estimated_value?: number;
  final_value?: number;
  due_date?: string;
  payment_date?: string;
  receipt_url?: string;
  responsible_id?: string;
  status?: string;
  created_at: string;
};

export type DocumentType = 'proposta' | 'contrato' | 'nda' | 'orcamento' | 'planta' | 'relatorio' | 'apresentacao' | 'parecer' | 'ata' | 'comprovante' | 'nota_fiscal' | 'ordem_servico' | 'documento_tecnico' | 'documento_regulatorio' | 'certificado' | 'outro';

export type Document = {
  id: string;
  title: string;
  type: DocumentType;
  client_id?: string;
  project_id?: string;
  opportunity_id?: string;
  responsible_id?: string;
  version?: number;
  date?: string;
  validity_date?: string;
  confidentiality?: string;
  tags?: string[];
  file_url?: string;
  created_at: string;
  updated_at?: string;
};

export type DocumentVersion = {
  id: string;
  document_id: string;
  version: number;
  uploaded_by?: string;
  date: string;
  file_url?: string;
  notes?: string;
};

export type Communication = {
  id: string;
  type: string;
  date: string;
  sender?: string;
  recipient?: string;
  subject?: string;
  summary?: string;
  opportunity_id?: string;
  project_id?: string;
  client_id?: string;
  attachments?: string[];
  next_action?: string;
  created_at: string;
};

export type NotificationType = 'tarefa' | 'projeto' | 'oportunidade' | 'proposta' | 'contrato' | 'financeiro' | 'documento' | 'mencao' | 'aprovacao';

export type Notification = {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  read_at?: string;
  created_at: string;
};

export type Approval = {
  id: string;
  requester_id: string;
  approver_id?: string;
  item_type: string;
  item_id: string;
  justification?: string;
  date: string;
  decision?: 'approved' | 'rejected' | 'pending';
  comment?: string;
  created_at: string;
};

export type AuditLog = {
  id: string;
  user_id?: string;
  entity_type: string;
  entity_id: string;
  operation: string;
  field_changed?: string;
  old_value?: string;
  new_value?: string;
  origin?: string;
  created_at: string;
};

export type KnowledgeCategory = 'processos' | 'procedimentos' | 'modelos' | 'templates' | 'respostas_padrao' | 'politicas' | 'metodologia' | 'fornecedores_recomendados' | 'licoes_aprendidas' | 'boas_praticas';

export type KnowledgeArticle = {
  id: string;
  title: string;
  category: KnowledgeCategory;
  content: string;
  tags?: string[];
  author_id?: string;
  project_id?: string;
  created_at: string;
  updated_at?: string;
};

export type Comment = {
  id: string;
  entity_type: string;
  entity_id: string;
  user_id: string;
  text: string;
  mentions?: string[];
  created_at: string;
};

export type Tag = {
  id: string;
  name: string;
  color?: string;
};

export type LessonLearned = {
  id: string;
  project_id: string;
  what_worked?: string;
  problems?: string;
  deviations?: string;
  rework?: string;
  supplier_feedback?: string;
  client_feedback?: string;
  deadline_feedback?: string;
  scope_feedback?: string;
  margin_feedback?: string;
  recommendations?: string;
  created_at: string;
};

// Helper Types
export type StatusConfig = {
  label: string;
  className: string;
};

export const LEAD_STATUS_MAP: Record<LeadStatus, StatusConfig> = {
  novo: { label: 'Novo', className: 'bg-blue-100 text-blue-800' },
  nao_contatado: { label: 'Não Contatado', className: 'bg-gray-100 text-gray-800' },
  tentativa_contato: { label: 'Tentativa de Contato', className: 'bg-yellow-100 text-yellow-800' },
  contatado: { label: 'Contatado', className: 'bg-indigo-100 text-indigo-800' },
  qualificacao: { label: 'Em Qualificação', className: 'bg-purple-100 text-purple-800' },
  qualificado: { label: 'Qualificado', className: 'bg-green-100 text-green-800' },
  nao_qualificado: { label: 'Não Qualificado', className: 'bg-red-100 text-red-800' },
  convertido: { label: 'Convertido', className: 'bg-emerald-100 text-emerald-800' },
  arquivado: { label: 'Arquivado', className: 'bg-slate-100 text-slate-800' },
};

export const OPPORTUNITY_STAGE_MAP: Record<OpportunityStage, StatusConfig> = {
  lead_identificado: { label: 'Lead Identificado', className: 'bg-blue-100 text-blue-800' },
  contato_realizado: { label: 'Contato Realizado', className: 'bg-indigo-100 text-indigo-800' },
  diagnostico: { label: 'Diagnóstico', className: 'bg-purple-100 text-purple-800' },
  escopo_definicao: { label: 'Definição de Escopo', className: 'bg-pink-100 text-pink-800' },
  orcamento_interno: { label: 'Orçamento Interno', className: 'bg-orange-100 text-orange-800' },
  proposta_elaboracao: { label: 'Elaboração de Proposta', className: 'bg-yellow-100 text-yellow-800' },
  proposta_enviada: { label: 'Proposta Enviada', className: 'bg-cyan-100 text-cyan-800' },
  negociacao: { label: 'Negociação', className: 'bg-amber-100 text-amber-800' },
  aprovacao_verbal: { label: 'Aprovação Verbal', className: 'bg-lime-100 text-lime-800' },
  contrato: { label: 'Contrato', className: 'bg-teal-100 text-teal-800' },
  ganho: { label: 'Ganho', className: 'bg-green-100 text-green-800' },
  perdido: { label: 'Perdido', className: 'bg-red-100 text-red-800' },
  suspenso: { label: 'Suspenso', className: 'bg-gray-100 text-gray-800' },
};

export const PROJECT_STATUS_MAP: Record<ProjectStatus, StatusConfig> = {
  preparacao: { label: 'Preparação', className: 'bg-blue-100 text-blue-800' },
  planejamento: { label: 'Planejamento', className: 'bg-indigo-100 text-indigo-800' },
  em_andamento: { label: 'Em Andamento', className: 'bg-green-100 text-green-800' },
  aguardando_cliente: { label: 'Aguardando Cliente', className: 'bg-yellow-100 text-yellow-800' },
  aguardando_fornecedor: { label: 'Aguardando Fornecedor', className: 'bg-orange-100 text-orange-800' },
  aguardando_parceiro: { label: 'Aguardando Parceiro', className: 'bg-amber-100 text-amber-800' },
  em_revisao: { label: 'Em Revisão', className: 'bg-purple-100 text-purple-800' },
  aguardando_aprovacao: { label: 'Aguardando Aprovação', className: 'bg-pink-100 text-pink-800' },
  suspenso: { label: 'Suspenso', className: 'bg-gray-100 text-gray-800' },
  concluido: { label: 'Concluído', className: 'bg-emerald-100 text-emerald-800' },
  cancelado: { label: 'Cancelado', className: 'bg-red-100 text-red-800' },
};

export const TASK_STATUS_MAP: Record<TaskStatus, StatusConfig> = {
  nao_iniciada: { label: 'Não Iniciada', className: 'bg-gray-100 text-gray-800' },
  planejada: { label: 'Planejada', className: 'bg-blue-100 text-blue-800' },
  em_andamento: { label: 'Em Andamento', className: 'bg-indigo-100 text-indigo-800' },
  aguardando_cliente: { label: 'Aguardando Cliente', className: 'bg-yellow-100 text-yellow-800' },
  aguardando_fornecedor: { label: 'Aguardando Fornecedor', className: 'bg-orange-100 text-orange-800' },
  aguardando_equipe: { label: 'Aguardando Equipe', className: 'bg-amber-100 text-amber-800' },
  bloqueada: { label: 'Bloqueada', className: 'bg-red-100 text-red-800' },
  em_revisao: { label: 'Em Revisão', className: 'bg-purple-100 text-purple-800' },
  concluida: { label: 'Concluída', className: 'bg-green-100 text-green-800' },
  cancelado: { label: 'Cancelada', className: 'bg-red-100 text-red-800' },
};
