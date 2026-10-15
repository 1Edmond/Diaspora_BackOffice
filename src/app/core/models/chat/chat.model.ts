export enum MessageType {
  Text = 0,
  Image = 1,
  File = 2,
  Voice = 3,
  Video = 4,
  System = 5,
}

export enum ConversationType {
  Direct = 0,
  Group = 1,
  Community = 2,
  Broadcast = 3,
}

export interface AttachmentDto {
  id: string;
  url: string;
  fileName: string;
  fileSizeBytes: number;
  mimeType: string;
}

export interface ReactionDto {
  id: string;
  chatProfileId: string;
  emoji: string;
}

export interface MessageDto {
  id: string;
  conversationId: string;
  senderChatProfileId: string;
  senderDisplayName: string;
  senderAvatarUrl?: string;
  type: MessageType;
  content?: string;
  replyToMessageId?: string;
  isDeleted: boolean;
  editedAt?: string;
  attachments: AttachmentDto[];
  reactions: ReactionDto[];
  createdAt: string;
}

export interface ConversationDto {
  id: string;
  type: ConversationType;
  title?: string;
  description?: string;
  avatarUrl?: string;
  lastMessage?: MessageDto;
  unreadCount: number;
  createdAt: string;
}

export interface ChatReport {
  id: string;
  conversationId: string;
  messageId?: string;
  reportedSenderId: string;
  reportedSenderName: string;
  reporterName: string;
  reason: string;
  messageSnippet?: string;
  reportedAt: string;
  status: 'Pending' | 'Dismissed' | 'ActionTaken';
}
