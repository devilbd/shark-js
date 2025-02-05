// export function getDeepValue(obj: any, path: string): any { 
//     return path.split('.').reduce((acc, part) => acc && acc[part], obj);
// }

export function getDeepValue(obj: any, path: string): any {
    return path.split('.').reduce((acc, key) => {
        if (/\[\d+\]/.test(key)) {
            const [arrayKey, index] = key.split(/\[|\]/).filter(Boolean);
                    return acc && acc[arrayKey] && acc[arrayKey][Number(index)];
                } else {
                    return acc && acc[key];
                }
            }, obj);
}

export function setDeepValue(obj: any, path: string, value: any): void { 
    const keys = path.split('.'); 
    const lastKey = keys.pop(); 
    const lastObj = keys.reduce((acc, key) => { 
        if (!acc[key]) { 
            acc[key] = {}; 
        } return acc[key]; 
    }, obj); 
    if (lastKey) { 
        lastObj[lastKey] = value; 
    } 
}