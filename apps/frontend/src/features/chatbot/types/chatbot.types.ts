import type { Satisfaction } from "@/types/common.types";

export interface ChatNodeChild {
    id: number
    title: string
    slug: string
    display_order: number
}

export interface ChatNode {
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
  children: ChatNodeChild[];
}

export interface ChatMessage {
  id: string;
  sender: "bot" | "user";
  text: string;
  nodeId?: number;
}

export interface SessionRatingPayload {
  navigation_flow: string[];
  flag: Satisfaction;
}