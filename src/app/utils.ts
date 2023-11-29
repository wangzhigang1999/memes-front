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


export function generateUUID() {
    let d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        let r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export function getUUID() {
    let uuid: any;
    // 在一些浏览器中，localStorage是不可用的，比如隐身模式，因此需要try catch
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
    try {
        let token = localStorage.getItem('token');
        if (token == null) {
            return '';
        }
        return token;
    } catch (e) {
        return '';
    }
}

// write to clipboard
export function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => alert('复制成功'))
}
