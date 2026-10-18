import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core'
import { CommonModule, DatePipe } from '@angular/common'
import { FormsModule } from '@angular/forms'
import { PageBreadcrumb } from '@app/components/page-breadcrumb/page-breadcrumb'
import { Icon } from '@app/components/icon/icon'
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap'
import { MarketplaceService } from '@core/services/marketplace.service'
import { ToastService } from '@core/services/toast.service'
import { MarketplaceParameter } from '@core/models/marketplace/parameter.model'

@Component({
  selector: 'app-marketplace-parameters',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe, PageBreadcrumb, Icon],
  templateUrl: './parameters.html',
  styles: [`
    .param-key {
      font-family: monospace;
      font-weight: 600;
      color: #405189;
    }
  `],
})
export class MarketplaceParametersComponent implements OnInit {
  parameters: MarketplaceParameter[] = []
  loading = false
  saving = false

  @ViewChild('editModal') editModal!: TemplateRef<any>
  modalRef: NgbModalRef | null = null

  selectedParam: MarketplaceParameter | null = null
  editValue = ''

  private readonly paramMetadata: Record<string, { label: string; unit?: string; hint?: string }> = {
    DefaultEscrowCommissionRate: {
      label: 'Taux de commission séquestre par défaut',
      unit: '% (décimal, ex: 0.10 pour 10%)',
      hint: 'Commission prélevée par la plateforme sur les règlements séquestre lorsqu’aucun taux spécifique par catégorie n’est configuré.',
    },
    DisputeAutoEscalationDays: {
      label: 'Délai d’escalade automatique des litiges',
      unit: 'jours',
      hint: 'Nombre de jours d’inactivité avant qu’un litige ouvert entre deux parties ne soit automatiquement transmis à l’arbitrage administratif.',
    },
    MaxParcelWeightKg: {
      label: 'Poids maximal autorisé par colis',
      unit: 'kg',
      hint: 'Poids physique maximum en kilogrammes accepté pour le transport de colis entre particuliers.',
    },
    MinParcelDeclaredValue: {
      label: 'Valeur marchande minimale déclarée',
      unit: 'EUR ou devise locale',
      hint: 'Valeur marchande minimale à renseigner pour la souscription de l’assurance colis.',
    },
  }

  constructor(
    private marketplaceService: MarketplaceService,
    private modalService: NgbModal,
    private toast: ToastService
  ) {}

  ngOnInit() {
    this.loadParameters()
  }

  loadParameters() {
    this.loading = true
    this.marketplaceService.getParameters().subscribe({
      next: (params) => {
        this.parameters = params
        this.loading = false
      },
      error: () => {
        this.toast.error('Erreur lors du chargement des paramètres marketplace.')
        this.loading = false
      },
    })
  }

  getLabel(key: string): string {
    return this.paramMetadata[key]?.label || key
  }

  getUnit(key: string): string {
    return this.paramMetadata[key]?.unit || ''
  }

  getHint(key: string): string {
    return this.paramMetadata[key]?.hint || ''
  }

  openEditModal(param: MarketplaceParameter) {
    this.selectedParam = param
    this.editValue = param.value
    this.modalRef = this.modalService.open(this.editModal, { centered: true })
  }

  save() {
    if (!this.selectedParam) return
    this.saving = true

    this.marketplaceService.updateParameter(this.selectedParam.key, this.editValue.trim()).subscribe({
      next: () => {
        this.toast.success(`Paramètre "${this.getLabel(this.selectedParam!.key)}" mis à jour.`)
        this.modalRef?.close()
        this.saving = false
        this.loadParameters()
      },
      error: () => {
        this.toast.error('Erreur lors de la mise à jour du paramètre.')
        this.saving = false
      },
    })
  }
}
