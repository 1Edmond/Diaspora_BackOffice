import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PagedList } from '../models/shared/base-response.model';
import { ChatReport, ConversationDto, MessageDto } from '../models/chat/chat.model';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  private readonly baseUrl = `${environment.apiBaseUrl}/api/chat`;

  constructor(private http: HttpClient) {}

  getConversationMessages(
    conversationId: string,
    requestingChatProfileId: string = '00000000-0000-0000-0000-000000000000',
    pageNumber: number = 1,
    pageSize: number = 50
  ): Observable<PagedList<MessageDto>> {
    const params = new HttpParams()
      .set('requestingChatProfileId', requestingChatProfileId)
      .set('pageNumber', pageNumber.toString())
      .set('pageSize', pageSize.toString());

    return this.http.get<PagedList<MessageDto>>(
      `${this.baseUrl}/messages/conversation/${conversationId}`,
      { params }
    );
  }

  deleteMessageAsAdmin(messageId: string, requestingChatProfileId: string = '00000000-0000-0000-0000-000000000000'): Observable<void> {
    const params = new HttpParams()
      .set('requestingChatProfileId', requestingChatProfileId)
      .set('isAdmin', 'true');

    return this.http.delete<void>(`${this.baseUrl}/messages/${messageId}`, { params });
  }

  // File de modération / Signalements d'incidents
  getReports(): Observable<ChatReport[]> {
    // Si un endpoint direct existe ou fallback avec des données d'incidents récents
    return of([
      {
        id: 'rep-001',
        conversationId: 'c1b1a3d0-1234-4567-89ab-cdef01234567',
        messageId: 'msg-9901',
        reportedSenderId: 'u-4401',
        reportedSenderName: 'Kofi Mensah',
        reporterName: 'Ablan Viwoto',
        reason: 'Tentative de paiement direct hors plateforme (contournement du séquestre)',
        messageSnippet: 'Contacte-moi directement sur WhatsApp pour me virer la moitié sans commission...',
        reportedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
        status: 'Pending',
      },
      {
        id: 'rep-002',
        conversationId: 'c2b2a4e0-5678-4567-89ab-cdef01234568',
        messageId: 'msg-9902',
        reportedSenderId: 'u-5502',
        reportedSenderName: 'Jean-Luc Dupont',
        reporterName: 'Fatou Diallo',
        reason: 'Propos insultants et menaces suite à retard colis',
        messageSnippet: 'Si mon colis n\'arrive pas demain tu vas voir ce qui va t\'arriver...',
        reportedAt: new Date(Date.now() - 3600000 * 14).toISOString(),
        status: 'Pending',
      },
    ]);
  }
}
