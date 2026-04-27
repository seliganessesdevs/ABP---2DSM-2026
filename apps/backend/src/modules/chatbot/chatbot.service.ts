import { ChatNodeResponseDTO, CreateInteractionLogDTO, ChatNodeChildDTO } from './chatbot.types';
import { AppError } from '../../errors/AppError';
import { db } from '../../config/database';

export class ChatbotService {
async getRootNode(): Promise<ChatNodeResponseDTO> {
  const rootNode = await db.chatNode.findFirst({
    where: { parent_id: null },
    include: {
      children: {
        orderBy: { display_order: 'asc' },
      },
    },
  });

  if (!rootNode) {
    throw new AppError('Nó raiz não encontrado', 404);
  }

  const formattedChildren: ChatNodeChildDTO[] = rootNode.children.map((child) => ({
    id: child.id,
    title: child.title,
    slug: child.slug,
    display_order: child.display_order,
  }));

  return {
    id: rootNode.id,
    title: rootNode.title,
    slug: rootNode.slug,
    prompt: rootNode.prompt,
    answer_summary: rootNode.answer_summary,
    evidence_excerpt: rootNode.evidence_excerpt,
    evidence_source: rootNode.evidence_source,
    parent_id: rootNode.parent_id,
    display_order: rootNode.display_order,
    is_active: rootNode.is_active,
    children: formattedChildren,
  } as ChatNodeResponseDTO;
}
      
async getNodeById(id: number): Promise<ChatNodeResponseDTO> {
  const node = await db.chatNode.findUnique({
    where: { id },
    include: {
      children: {
        orderBy: { display_order: 'asc' },
      },
    },
  });

  if (!node) {
    throw new AppError('Nó não encontrado', 404);
  }

  // Mapear filhos para ChatNodeChildDTO
  const formattedChildren: ChatNodeChildDTO[] = node.children.map((child) => ({
    id: child.id,
    title: child.title,
    slug: child.slug,
    display_order: child.display_order,
  }));

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



async createInteractionLog(data: CreateInteractionLogDTO): Promise<{ interactionLogId: number }> {
  const log = await db.sessionLog.create({
    data: {
      navigation_flow: data.navigation_flow,
      flag: data.flag,
    },
  });
  return { interactionLogId: log.id };
}

}