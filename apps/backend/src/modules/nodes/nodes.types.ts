export interface CreateNodeDTO  {
      title: string;
      slug: string;
      prompt?: string | null;
      answer_summary?: string | null;
      evidence_excerpt?: string | null;
      evidence_source?: string | null;
      parent_id: number | null;
      display_order: number;
      is_active?: boolean;
}
export interface UpdateNodeDTO {
      title?: string;
      slug?: string;
      prompt?: string | null;
      answer_summary?: string | null;
      evidence_excerpt?: string | null;
      evidence_source?: string | null;
      parent_id?: number | null;
      display_order?: number;
      is_active?: boolean;
}

export interface NodeListItemDTO {
      id: number;
      title: string;
      slug: string;
      parent_id?: number | null;
      display_order: number;
      is_active: boolean;
      childrenCount: number;
}
