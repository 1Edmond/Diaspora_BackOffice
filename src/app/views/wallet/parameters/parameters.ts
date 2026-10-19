import { Component, OnInit } from '@angular/core'
import { CommonModule } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { WalletService } from '@core/services/wallet.service'
import { WalletParameterDto } from '@core/models/wallet/wallet.model'

@Component({
  selector: 'app-wallet-parameters',
  standalone: true,
  imports: [CommonModule, PageBreadcrumb, FormsModule],
  templateUrl: './parameters.html',
  styles: ``,
})
export class WalletParameters implements OnInit {
  parameters: WalletParameterDto[] = []
  loading = false
  saving = false
  error = ''
  success = ''
  editKey = ''
  editValue = ''
  editDescription = ''

  constructor(
    private walletService: WalletService
  ) {}

  ngOnInit() {
    this.loadParameters()
  }

  loadParameters() {
    this.loading = true
    this.walletService.getParameters().subscribe({
      next: (res) => { this.parameters = res; this.loading = false },
      error: () => { this.loading = false },
    })
  }

  edit(param: WalletParameterDto) {
    this.editKey = param.key
    this.editValue = param.value
    this.editDescription = param.description || ''
  }

  save() {
    this.saving = true
    this.walletService.updateParameter(this.editKey, { value: this.editValue }).subscribe({
      next: () => {
        this.saving = false
        this.success = 'Paramètre mis à jour avec succès'
        this.editKey = ''
        this.editValue = ''
        this.editDescription = ''
        this.loadParameters()
      },
      error: (err: any) => {
        this.saving = false
        this.error = err.error?.error || err.error?.message || 'Échec de la mise à jour'
      },
    })
  }

  clearMessages() {
    this.error = ''
    this.success = ''
  }
}
