export interface ChatNodeChildDTO  {
  id: number;
  title: string;
  slug: string;
  display_order: number;
}

export interface ChatNodeResponseDTO  {
    id: number;
    title: string;
    slug: string;
    prompt: string | null;
    answer_summary: string | null;
    evidence_excerpt: string | null;
    evidence_source: string | null;
    parent_id: number | null;
    display_order: number;
    is_active: boolean;
    children: ChatNodeChildDTO[];
}

export interface SessionFeedbackEntryDTO {
    node_id: number;
    flag: "ATENDEU" | "NAO_ATENDEU";
    navigation_flow: string[];
    recorded_at: string;
}

export interface CreateInteractionLogDTO {
    navigation_flow: string[];
    flag: "ATENDEU" | "NAO_ATENDEU";
    node_id: number;
    session_log_id?: number;
}
