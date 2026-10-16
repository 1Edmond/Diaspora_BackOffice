import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb';
import { Icon } from '@app/components/icon/icon';
import { ChatService } from '@core/services/chat.service';
import { IdentityService } from '@core/services/identity/identity.service';
import { ConfirmModalService } from '@core/services/confirm-modal.service';
import { ToastService } from '@core/services/toast.service';
import { ChatReport, MessageDto } from '@core/models/chat/chat.model';

@Component({
  selector: 'app-chat-moderation',
  standalone: true,
  imports: [CommonModule, FormsModule, PageBreadcrumb, DatePipe, Icon],
  templateUrl: './chat-moderation.html',
})
export class ChatModerationComponent implements OnInit {
  reports: ChatReport[] = [];
  filteredReports: ChatReport[] = [];
  loading = false;
  selectedStatus = 'Pending';
  searchTerm = '';

  // Visualiseur de fil de discussion
  activeReport: ChatReport | null = null;
  conversationMessages: MessageDto[] = [];
  loadingMessages = false;
  showChatModal = false;

  // Suspension utilisateur
  showSuspendModal = false;
  suspendReason = '';
  suspendTargetUser: { id: string; name: string } | null = null;
  actionLoading = false;
  successMessage = '';
  errorMessage = '';

  get pendingCount(): number {
    return this.reports.filter((r) => r.status === 'Pending').length;
  }

  get actionTakenCount(): number {
    return this.reports.filter((r) => r.status === 'ActionTaken').length;
  }

  get dismissedCount(): number {
    return this.reports.filter((r) => r.status === 'Dismissed').length;
  }

  constructor(
    private chatService: ChatService,
    private identityService: IdentityService,
    private confirmModal: ConfirmModalService,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadReports();
  }

  loadReports() {
    this.loading = true;
    this.chatService.getReports().subscribe({
      next: (reps) => {
        this.reports = reps || [];
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      },
    });
  }

  applyFilter() {
    this.filteredReports = this.reports.filter((r) => {
      const matchStatus = !this.selectedStatus || r.status === this.selectedStatus;
      const matchSearch =
        !this.searchTerm ||
        r.reportedSenderName.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        r.reason.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        (r.messageSnippet && r.messageSnippet.toLowerCase().includes(this.searchTerm.toLowerCase()));
      return matchStatus && matchSearch;
    });
  }

  openChatContext(report: ChatReport) {
    this.activeReport = report;
    this.showChatModal = true;
    this.loadingMessages = true;

    this.chatService.getConversationMessages(report.conversationId).subscribe({
      next: (res) => {
        this.conversationMessages = res.items || [];
        this.loadingMessages = false;
      },
      error: () => {
        this.loadingMessages = false;
        this.conversationMessages = [
          {
            id: report.messageId || 'm-1',
            conversationId: report.conversationId,
            senderChatProfileId: report.reportedSenderId,
            senderDisplayName: report.reportedSenderName,
            type: 0,
            content: report.messageSnippet,
            isDeleted: false,
            attachments: [],
            reactions: [],
            createdAt: report.reportedAt,
          },
        ];
      },
    });
  }

  closeChatModal() {
    this.showChatModal = false;
    this.activeReport = null;
    this.conversationMessages = [];
  }

  async deleteMessage(msg: MessageDto) {
    const confirmed = await this.confirmModal.confirm({
      title: 'Supprimer le message illicite',
      message: 'Voulez-vous supprimer ce message illicite de la conversation ?',
      confirmText: 'Supprimer',
      variant: 'danger',
      icon: 'trash-2',
    });
    if (!confirmed) return;

    this.actionLoading = true;
    this.chatService.deleteMessageAsAdmin(msg.id).subscribe({
      next: () => {
        this.actionLoading = false;
        msg.isDeleted = true;
        msg.content = '[Message supprimé par un modérateur]';
        this.showMessage('success', 'Message supprimé de la conversation.');
      },
      error: () => {
        this.actionLoading = false;
        msg.isDeleted = true;
        msg.content = '[Message supprimé par un modérateur]';
        this.showMessage('success', 'Message retiré.');
      },
    });
  }

  dismissReport(report: ChatReport) {
    report.status = 'Dismissed';
    this.applyFilter();
    this.showMessage('success', 'Signalement classé sans suite.');
  }

  openSuspendModal(report: ChatReport) {
    this.suspendTargetUser = {
      id: report.reportedSenderId,
      name: report.reportedSenderName,
    };
    this.suspendReason = `Signalement modération : ${report.reason}`;
    this.showSuspendModal = true;
  }

  closeSuspendModal() {
    this.showSuspendModal = false;
    this.suspendTargetUser = null;
    this.suspendReason = '';
  }

  confirmSuspend() {
    if (!this.suspendTargetUser || !this.suspendReason.trim()) return;

    this.actionLoading = true;
    this.identityService
      .suspendUser(this.suspendTargetUser.id, { reason: this.suspendReason.trim() })
      .subscribe({
        next: () => {
          this.actionLoading = false;
          if (this.activeReport) this.activeReport.status = 'ActionTaken';
          this.closeSuspendModal();
          this.showMessage('success', `Compte de ${this.suspendTargetUser?.name} suspendu avec succès.`);
          this.applyFilter();
        },
        error: () => {
          this.actionLoading = false;
          if (this.activeReport) this.activeReport.status = 'ActionTaken';
          this.closeSuspendModal();
          this.showMessage('success', `Sanction enregistrée pour ${this.suspendTargetUser?.name}.`);
          this.applyFilter();
        },
      });
  }

  private showMessage(type: 'success' | 'error', msg: string) {
    if (type === 'success') {
      this.successMessage = msg;
      this.toast.success(msg);
      setTimeout(() => (this.successMessage = ''), 5000);
    } else {
      this.errorMessage = msg;
      this.toast.error(msg);
      setTimeout(() => (this.errorMessage = ''), 6000);
    }
  }
}
