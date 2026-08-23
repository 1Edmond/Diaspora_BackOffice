import { getColor } from '@/app/utils/string'

const bodyFont = getComputedStyle(document.body).fontFamily.trim()

export type KPIItem = {
  title: string
  value: number
  prefix: string
  suffix: string
  icon: string
  className: string
  chartData?: number[]
  chartColor?: string
}

export const kpiData: KPIItem[] = [
  {
    title: 'Total Users',
    value: 12450,
    prefix: '',
    suffix: '',
    icon: 'ph-users-three',
    className: 'primary',
    chartColor: getColor('primary'),
  },
  {
    title: 'Active Users',
    value: 11230,
    prefix: '',
    suffix: '',
    icon: 'ph-user-check',
    className: 'success',
    chartColor: getColor('success'),
  },
  {
    title: 'KYC Verified',
    value: 8670,
    prefix: '',
    suffix: '',
    icon: 'ph-shield-check',
    className: 'info',
    chartColor: getColor('info'),
  },
  {
    title: 'Pending KYC',
    value: 3780,
    prefix: '',
    suffix: '',
    icon: 'ph-clock',
    className: 'warning',
    chartColor: getColor('warning'),
  },
  {
    title: 'KYC Rate',
    value: 69.6,
    prefix: '',
    suffix: '%',
    icon: 'ph-percentile',
    className: 'secondary',
    chartColor: getColor('secondary'),
  },
]

export const kycLevelData = [
  { level: 'No KYC', users: 3780, color: 'danger' },
  { level: 'Basic', users: 1540, color: 'warning' },
  { level: 'Intermediate', users: 1820, color: 'info' },
  { level: 'Advanced', users: 5310, color: 'success' },
]