export const toQueryString = <T>(filters: T): string => {
  const params = new URLSearchParams()
  if (!filters) return ''
  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      if (Array.isArray(value)) {
        value.forEach((valueElement) => params.append(key, String(valueElement)))
      } else {
        params.append(key, String(value))
      }
    }
  })
  return params.toString()
}

export const getPriorityColor = (
  priority: 'highest' | 'high' | 'medium' | 'low' | 'lowest',
): string => {
  switch (priority) {
    case 'highest':
      return 'bg-red-500 text-white'
    case 'high':
      return 'bg-orange-500 text-white'
    case 'medium':
      return 'bg-yellow-500 text-black'
    case 'low':
      return 'bg-green-500 text-white'
    case 'lowest':
      return 'bg-gray-500 text-white'
    default:
      return ''
  }
}

export const calculateStatsChanges = (value: any, stat: string) => {
  if (!value || !stat)
    return {
      value: 0,
    }
  const current = value[stat] || 0
  const previous = value?.comparison?.[stat] || 0
  const change = current - previous
  const percentage = previous ? (change / previous) * 100 : 0
  const percentageStr = parseFloat(percentage.toFixed(2)) + '%'
  if (percentage > 0) {
    return { value: percentageStr, class: 'positive' }
  } else if (percentage < 0) {
    return { value: percentageStr, class: 'negative' }
  } else {
    return { value: 0 }
  }
}

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return '--/--/--'
  return new Date(dateString).toLocaleDateString()
}

export const formatTime = (dateString: string | undefined) => {
  if (!dateString) return '--:--'
  return new Date(dateString).toLocaleTimeString()
}

export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return (value / 1000000).toFixed(1) + 'M'
  } else if (value >= 1000) {
    return (value / 1000).toFixed(1) + 'K'
  }
  return value.toString()
}

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(value)
}

export const formatPercentage = (value: number): string => {
  return (value * 100).toFixed(1) + '%'
}

export const format = (value: any, formatType: string): string => {
  if (!value) return '0'

  switch (formatType) {
    case 'currency':
      return formatCurrency(value)
    case 'number':
      return formatNumber(value)
    case 'percentage':
      return formatPercentage(value)
    default:
      return value.toString()
  }
}

// const utilities = new Utilities()

// export default utilities
