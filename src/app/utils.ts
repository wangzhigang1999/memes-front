export function authorized(): boolean {
  try {
    const item = localStorage.getItem('token-ok')
    return item === 'true'
  } catch (e) {
    return false
  }
}

export function generateUUID() {
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'
  return uuid.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export function getUUID() {
  let uuid: any
  // 在一些浏览器中，localStorage 是不可用的，比如隐身模式，因此需要 try catch
  try {
    uuid = localStorage.getItem('uuid')
    if (uuid == null) {
      uuid = generateUUID()
      // @ts-ignore
      localStorage.setItem('uuid', uuid)
    }
  } catch (e) {
    uuid = generateUUID()
  }
  return uuid
}

export function getToken(): string {
  let token: string
  try {
    token = localStorage.getItem('token') || ''
  } catch (e) {
    token = ''
  }
  return token
}

// write to clipboard
export function copyToClipboard(text: string) {
  navigator.clipboard
    .writeText(text)
    .then(() => alert('已经成功复制到剪贴板，快去分享吧~'))
    .catch(() => alert('复制失败，请手动复制'))
}

// scroll to top
export function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

export function getConfig(key: string, type?: string): any {
  try {
    const storedValue = localStorage.getItem(key)

    if (storedValue === null) {
      console.warn(`[getConfig] Key not found: ${key}`)
      return null
    }

    console.debug(`[getConfig] Retrieved key=${key}, rawValue=${storedValue}, expectedType=${type}`)

    if (type === 'BOOLEAN') {
      const parsedValue = storedValue === 'true'
      console.debug(`[getConfig] Parsed Boolean: ${parsedValue}`)
      return parsedValue
    } else if (type === 'INTEGER') {
      const parsedValue = Number.parseInt(storedValue, 10) || 0
      console.debug(`[getConfig] Parsed Integer: ${parsedValue}`)
      return parsedValue
    }

    console.debug(`[getConfig] Returning as STRING: ${storedValue}`)
    return storedValue
  } catch (error) {
    console.error(`[getConfig] Error retrieving key=${key}:`, error)
    return null
  }
}

export function setConfig(key: string, value: any): void {
  try {
    let storedValue = value

    if (typeof value === 'boolean') {
      storedValue = value ? 'true' : 'false'
    } else if (typeof value === 'number') {
      storedValue = value.toString()
    }

    localStorage.setItem(key, storedValue)
    console.info(`[setConfig] Successfully set key=${key}, value=${storedValue} (originalType=${typeof value})`)
  } catch (error) {
    console.error(`[setConfig] Error setting key=${key} with value=${value}:`, error)
  }
}

export function isSmallScreen() {
  return window.innerWidth < 768
}
