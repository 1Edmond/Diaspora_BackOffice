import { getColor } from '@/app/utils/string'

export type KYCKPIItem = {
  title: string
  value: number
  prefix: string
  suffix: string
  icon: string
  className: string
}

export const kycKpiData: KYCKPIItem[] = [
  {
    title: 'Total Verifications',
    value: 0,
    prefix: '',
    suffix: '',
    icon: 'ph-shield-check',
    className: 'primary',
  },
  {
    title: 'Pending Review',
    value: 0,
    prefix: '',
    suffix: '',
    icon: 'ph-clock',
    className: 'warning',
  },
  {
    title: 'Approved',
    value: 0,
    prefix: '',
    suffix: '',
    icon: 'ph-check-circle',
    className: 'success',
  },
  {
    title: 'Rejected',
    value: 0,
    prefix: '',
    suffix: '',
    icon: 'ph-x-circle',
    className: 'danger',
  },
  {
    title: 'Approval Rate',
    value: 0,
    prefix: '',
    suffix: '%',
    icon: 'ph-trend-up',
    className: 'info',
  },
]
