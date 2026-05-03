import {
  ChatNodeChildDTO,
  ChatNodeResponseDTO,
  CreateInteractionLogDTO,
  SessionFeedbackEntryDTO,
} from "./chatbot.types";
import { Prisma } from "@prisma/client";
import { AppError } from "../../errors/AppError";
import { db } from "../../config/database";

function isFeedbackHistoryUnavailableError(error: unknown): boolean {
  if (!(error instanceof Error)) {
    return false;
  }

  return error.message.includes("feedback_history");
}

function toJsonFeedbackHistory(
  feedbackHistory: SessionFeedbackEntryDTO[],
): Prisma.InputJsonValue {
  return feedbackHistory as unknown as Prisma.InputJsonValue;
}

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

    const formattedChildren: ChatNodeChildDTO[] = node.children.map((child) => ({
      id: child.id,
      title: child.title,
      slug: child.slug,
      display_order: child.display_order,
    }));

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
    const feedbackEntry: SessionFeedbackEntryDTO = {
      node_id: data.node_id,
      flag: data.flag,
      navigation_flow: data.navigation_flow,
      recorded_at: new Date().toISOString(),
    };

    if (data.session_log_id) {
      const existingLog = await db.sessionLog.findUnique({
        where: { id: data.session_log_id },
        select: { id: true },
      });

      if (!existingLog) {
        throw new AppError("Sessão de atendimento não encontrada", 404);
      }

      try {
        const logWithFeedbackHistory = await db.sessionLog.findUnique({
          where: { id: data.session_log_id },
          select: { feedback_history: true },
        });

        const existingFeedbackHistory = Array.isArray(
          logWithFeedbackHistory?.feedback_history,
        )
          ? (logWithFeedbackHistory.feedback_history as unknown as SessionFeedbackEntryDTO[])
          : [];

        const updatedLog = await db.sessionLog.update({
          where: { id: data.session_log_id },
          data: {
            navigation_flow: data.navigation_flow,
            node_id: data.node_id,
            flag: data.flag,
            feedback_history: toJsonFeedbackHistory([
              ...existingFeedbackHistory,
              feedbackEntry,
            ]),
          },
        });

        return { interactionLogId: updatedLog.id };
      } catch (error) {
        if (!isFeedbackHistoryUnavailableError(error)) {
          throw error;
        }

        const updatedLog = await db.sessionLog.update({
          where: { id: data.session_log_id },
          data: {
            navigation_flow: data.navigation_flow,
            node_id: data.node_id,
            flag: data.flag,
          },
        });

        return { interactionLogId: updatedLog.id };
      }
    }

    try {
      const log = await db.sessionLog.create({
        data: {
          navigation_flow: data.navigation_flow,
          node_id: data.node_id,
          flag: data.flag,
          feedback_history: toJsonFeedbackHistory([feedbackEntry]),
        },
      });

      return { interactionLogId: log.id };
    } catch (error) {
      if (!isFeedbackHistoryUnavailableError(error)) {
        throw error;
      }

      const log = await db.sessionLog.create({
        data: {
          navigation_flow: data.navigation_flow,
          node_id: data.node_id,
          flag: data.flag,
        },
      });

      return { interactionLogId: log.id };
    }
  }
}
