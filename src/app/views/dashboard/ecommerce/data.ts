import { getColor } from '@/app/utils/string'
import { ChartConfiguration, ChartDataset } from 'chart.js'
const bodyFont = getComputedStyle(document.body).fontFamily.trim()

const product1 = 'assets/images/products/1.png'
const product2 = 'assets/images/products/2.png'
const product3 = 'assets/images/products/3.png'
const product4 = 'assets/images/products/4.png'
const product5 = 'assets/images/products/5.png'
const product6 = 'assets/images/products/6.png'
const product7 = 'assets/images/products/7.png'
const product8 = 'assets/images/products/8.png'
const product9 = 'assets/images/products/9.png'

const user1 = 'assets/images/users/user-1.jpg'
const user2 = 'assets/images/users/user-2.jpg'
const user3 = 'assets/images/users/user-3.jpg'
const user4 = 'assets/images/users/user-4.jpg'
const user5 = 'assets/images/users/user-5.jpg'
const user6 = 'assets/images/users/user-6.jpg'
const user7 = 'assets/images/users/user-7.jpg'
const user8 = 'assets/images/users/user-8.jpg'
const user9 = 'assets/images/users/user-9.jpg'
const user10 = 'assets/images/users/user-10.jpg'

export type StateType = {
  title: string
  value: number
  prefix: string
  suffix: string
  icon: string
  className: string
}

export const stateData: StateType[] = [
  {
    title: 'Total Sales',
    value: 124.7,
    prefix: '$',
    suffix: 'K',
    icon: 'tabler:credit-card',
    className: 'bg-primary-subtle text-primary',
  },
  {
    title: 'Orders Placed',
    value: 2358,
    prefix: '',
    suffix: '',
    icon: 'tabler:shopping-cart',
    className: 'bg-success-subtle text-success',
  },
  {
    title: 'Active Customers',
    value: 839,
    prefix: '',
    suffix: '',
    icon: 'tabler:users',
    className: 'bg-info-subtle text-info',
  },
  {
    title: 'Refund Requests',
    value: 41,
    prefix: '',
    suffix: '',
    icon: 'tabler:rotate-clockwise-2',
    className: 'bg-warning-subtle text-warning',
  },
]

export const multiPieChartOptions = (): ChartConfiguration<'doughnut'> => ({
  type: 'doughnut',
  data: {
    labels: ['Online Store', 'Retail Stores', 'B2B Revenue', 'Marketplace Revenue'],
    datasets: [
      {
        label: '2024',
        data: [300, 150, 100, 80],
        backgroundColor: [getColor('chart-primary'), getColor('chart-secondary'), getColor('chart-alpha'), getColor('chart-gray')],
        borderColor: 'transparent',
        borderWidth: 1,
        weight: 1, // Outer ring
        cutout: '30%',
        radius: '90%',
      } as ChartDataset<'doughnut'>,
      {
        label: '2023',
        data: [270, 135, 90, 72],
        backgroundColor: [getColor('chart-primary-rgb', 0.3), getColor('chart-secondary-rgb', 0.3), getColor('chart-alpha-rgb', 0.3), getColor('chart-gray-rgb', 0.3)],
        borderColor: 'transparent',
        borderWidth: 3,
        weight: 0.8, // Inner ring
        cutout: '30%',
        radius: '60%', // smaller to create spacing
      } as ChartDataset<'doughnut'>,
    ],
  },
  options: {
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          font: { family: bodyFont },
          color: getColor('secondary-color'),
          usePointStyle: true, // Show circles instead of default box
          pointStyle: 'circle', // Circle shape
          boxWidth: 8, // Circle size
          boxHeight: 8, // (optional) same as width by default
          padding: 15, // Space between legend items
        },
      },
      tooltip: {
        callbacks: {
          label: function (ctx) {
            return `${ctx.dataset.label} - ${ctx.label}: ${ctx.parsed}`
          },
        },
      },
    },
    scales: {
      x: { display: false },
      y: { display: false },
    },
  },
})

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const generateRandomData = (min: number, max: number): number[] => Array.from({ length: 12 }, () => Math.floor(Math.random() * (max - min + 1)) + min)

const onlineSales = generateRandomData(1000, 1250)
const inStoreSales = generateRandomData(800, 1250)

const totalSales = generateRandomData(2500, 3500)

export const stackedBarLineChartOptions = (): ChartConfiguration => ({
  type: 'bar',
  options: {},
  data: {
    labels: months,
    datasets: [
      {
        type: 'bar',
        label: 'Online Sales',
        data: onlineSales,
        borderColor: getColor('chart-primary'),
        backgroundColor: getColor('chart-primary'),
        stack: 'sales',
        barThickness: 20,
        borderRadius: 6,
      },
      {
        type: 'bar',
        label: 'In-store Sales',
        data: inStoreSales,
        borderColor: getColor('chart-gray'),
        backgroundColor: getColor('chart-gray'),
        stack: 'sales',
        barThickness: 20,
        borderRadius: 6,
      },
      {
        type: 'line',
        label: 'Projected Sales',
        data: totalSales,
        borderColor: getColor('chart-alpha'),
        backgroundColor: getColor('chart-alpha-rgb', 0.2),
        borderWidth: 2,
        borderDash: [5, 5], // dashed line
        tension: 0.4,
        fill: false,
        yAxisID: 'y',
      },
    ],
  },
})
export type ProductType = {
  image: string
  category: string
  name: string
  stock: number
  price: string
  rating: number
  reviews: number
  status: 'active' | 'low-stock' | 'out-of-stock' | 'limited'
  className: string
}

export const productData: ProductType[] = [
  {
    image: product1,
    category: 'Audio',
    name: 'Wireless Earbuds',
    stock: 180,
    price: '$59.90',
    rating: 4,
    reviews: 52,
    status: 'active',
    className: 'text-success',
  },
  {
    image: product2,
    category: 'Accessories',
    name: 'Laptop Stand',
    stock: 45,
    price: '$29.0',
    rating: 3,
    reviews: 11,
    status: 'low-stock',
    className: 'text-warning',
  },
  {
    image: product3,
    category: 'Gadgets',
    name: 'Drone Camera',
    stock: 0,
    price: '$199.99',
    rating: 4.5,
    reviews: 8,
    status: 'out-of-stock',
    className: 'text-danger',
  },
  {
    image: product4,
    category: 'Electronics',
    name: 'Portable Projector',
    stock: 32,
    price: '$120.00',
    rating: 3,
    reviews: 16,
    status: 'limited',
    className: 'text-warning',
  },
  {
    image: product5,
    category: 'Mobiles',
    name: 'Smartphone G12',
    stock: 85,
    price: '$499.00',
    rating: 4,
    reviews: 112,
    status: 'active',
    className: 'text-success',
  },
  {
    image: product6,
    category: 'Audio',
    name: 'Noise Cancelling Headphones',
    stock: 25,
    price: '$129.99',
    rating: 4.5,
    reviews: 78,
    status: 'low-stock',
    className: 'text-warning',
  },
  {
    image: product7,
    category: 'Home Tech',
    name: 'Mini Air Purifier',
    stock: 0,
    price: '$49.99',
    rating: 3.5,
    reviews: 34,
    status: 'out-of-stock',
    className: 'text-danger',
  },
  {
    image: product8,
    category: 'Accessories',
    name: 'USB-C Docking Station',
    stock: 142,
    price: '$89.00',
    rating: 5,
    reviews: 64,
    status: 'active',
    className: 'text-success',
  },
  {
    image: product9,
    category: 'Gadgets',
    name: 'Digital Photo Frame',
    stock: 58,
    price: '$74.95',
    rating: 4,
    reviews: 40,
    status: 'active',
    className: 'text-success',
  },
]

export type OrderType = {
  id: string
  name: string
  image: string
  product: string
  date: string
  amount: string
  status: 'delivered' | 'pending' | 'completed' | 'Cancelled'
  className: string
}

export const orderData: OrderType[] = [
  {
    id: '#ORD-2001',
    name: 'Alice Cooper',
    image: user1,
    product: 'Noise Cancelling Headphones',
    date: '2025-05-01',
    amount: '$199.99',
    status: 'delivered',
    className: 'text-success',
  },
  {
    id: '#ORD-2002',
    name: 'David Lee',
    image: user2,
    product: '4K Monitor',
    date: '2025-04-30',
    amount: '$349.00',
    status: 'pending',
    className: 'text-warning',
  },
  {
    id: '#ORD-2003',
    name: 'Sophia Turner',
    image: user3,
    product: 'Mechanical Keyboard',
    date: '2025-04-29',
    amount: '$89.49',
    status: 'completed',
    className: 'text-success',
  },
  {
    id: '#ORD-2004',
    name: 'James Wilson',
    image: user4,
    product: 'Drone Camera',
    date: '2025-04-28',
    amount: '$450.00',
    status: 'Cancelled',
    className: 'text-danger',
  },
  {
    id: '#ORD-2005',
    name: 'Ava Carter',
    image: user5,
    product: 'Wireless Earbuds',
    date: '2025-04-27',
    amount: '$129.99',
    status: 'completed',
    className: 'text-success',
  },
  {
    id: '#ORD-2011',
    name: 'Ethan Brooks',
    image: user6,
    product: 'VR Headset',
    date: '2025-05-02',
    amount: '$299.00',
    status: 'completed',
    className: 'text-success',
  },
  {
    id: '#ORD-2012',
    name: 'Mia Clarke',
    image: user7,
    product: 'Portable Charger',
    date: '2025-05-01',
    amount: '$59.99',
    status: 'completed',
    className: 'text-success',
  },
  {
    id: '#ORD-2013',
    name: 'Lucas Perry',
    image: user8,
    product: 'Smartphone Gimbal',
    date: '2025-04-30',
    amount: '$149.99',
    status: 'pending',
    className: 'text-warning',
  },
  {
    id: '#ORD-2014',
    name: 'Chloe Adams',
    image: user9,
    product: 'LED Desk Lamp',
    date: '2025-04-29',
    amount: '$45.00',
    status: 'delivered',
    className: 'text-success',
  },
  {
    id: '#ORD-2015',
    name: 'Benjamin Gray',
    image: user10,
    product: 'Noise Meter',
    date: '2025-04-28',
    amount: '$75.49',
    status: 'delivered',
    className: 'text-success',
  },
]
