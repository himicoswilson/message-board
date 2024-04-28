export function formatDate(value) {
  if (!value) return ''
  const date = new Date(value)
  const year = date.getFullYear()
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')

  // 格式化日期為 'YYYY.MM.DD HH:mm'
  return `${year}.${month}.${day} ${hours}:${minutes}`
}
