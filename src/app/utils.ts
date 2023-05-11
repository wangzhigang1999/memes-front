export function authorized(): boolean {
  try {
    let item = localStorage.getItem('token-ok');
    if (item == null) {
      return false;
    }
    if (item == 'true') {
      return true;
    }
  } catch (e) {
    return false;
  }
  return false
}
