import {
  ChatNodeResponseDTO,
  CreateInteractionLogDTO,
  ChatNodeChildDTO,
} from "./chatbot.types";
import { AppError } from "../../errors/AppError";
import { db } from "../../config/database";

export class ChatbotService {
  async getRootNode(): Promise<ChatNodeResponseDTO> {
    const rootNodes = await db.chatNode.findMany({
      where: { parent_id: null },
      orderBy: { display_order: "asc" },
    });

    if (rootNodes.length === 0) {
      throw new AppError("Nó raiz não encontrado", 404);
    }

    const formattedChildren: ChatNodeChildDTO[] = rootNodes.map((child) => ({
      id: child.id,
      title: child.title,
      slug: child.slug,
      display_order: child.display_order,
    }));

    return {
      id: 0,
      title: "Início",
      slug: "root",
      prompt: "Para qual assunto você gostaria de obter informações?",
      answer_summary: null,
      evidence_excerpt: null,
      evidence_source: null,
      parent_id: null,
      display_order: 0,
      is_active: true,
      children: formattedChildren,
    } as ChatNodeResponseDTO;
  }

  async getNodeById(id: number): Promise<ChatNodeResponseDTO> {
    const node = await db.chatNode.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { display_order: "asc" },
        },
      },
    });

    if (!node) {
      throw new AppError("Nó não encontrado", 404);
    }

    // Mapear filhos para ChatNodeChildDTO
    const formattedChildren: ChatNodeChildDTO[] = node.children.map(
      (child) => ({
        id: child.id,
        title: child.title,
        slug: child.slug,
        display_order: child.display_order,
      }),
    );

    // Retornar objeto no formato ChatNodeResponseDTO
    return {
      id: node.id,
      title: node.title,
      slug: node.slug,
      prompt: node.prompt,
      answer_summary: node.answer_summary,
      evidence_excerpt: node.evidence_excerpt,
      evidence_source: node.evidence_source,
      parent_id: node.parent_id,
      display_order: node.display_order,
      is_active: node.is_active,
      children: formattedChildren,
    } as ChatNodeResponseDTO;
  }

  async createInteractionLog(
    data: CreateInteractionLogDTO,
  ): Promise<{ interactionLogId: number }> {
    const log = await db.sessionLog.create({
      data: {
        navigation_flow: data.navigation_flow,
        flag: data.flag,
      },
    });
    return { interactionLogId: log.id };
  }
}
