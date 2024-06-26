export function authorized(): boolean {
  try {
    const item = localStorage.getItem('token-ok');
    return item === 'true';
  } catch (e) {
    return false;
  }
}


export function generateUUID() {
  let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';
  return uuid.replace(/[xy]/g, function (c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}


export function getUUID() {
  let uuid: any;
  // 在一些浏览器中，localStorage 是不可用的，比如隐身模式，因此需要 try catch
  try {
    uuid = localStorage.getItem('uuid');
    if (uuid == null) {
      uuid = generateUUID();
      // @ts-ignore
      localStorage.setItem('uuid', uuid);
    }
  } catch (e) {
    uuid = generateUUID();
  }
  return uuid;
}

export function getToken(): string {
  let token: string;
  try {
    token = localStorage.getItem('token') || '';
  } catch (e) {
    token = '';
  }
  return token;
}


// write to clipboard
export function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => alert('已经成功复制到剪贴板，快去分享吧~')).catch(() => alert('复制失败，请手动复制'))
}


// scroll to top
export function scrollToTop() {
  window.scrollTo({top: 0, behavior: 'smooth'});
}


export function getConfig(key: string): boolean {
  try {
    const item = localStorage.getItem(key);
    return item === 'true';
  } catch (e) {
    return true;
  }
}


export function setConfig(key: string, value: boolean) {
  try {
    localStorage.setItem(key, value ? 'true' : 'false');
  } catch (e) {
    alert('设置失败，请稍后再试~')
  }
}


export function isSmallScreen() {
  return window.innerWidth < 768
}
