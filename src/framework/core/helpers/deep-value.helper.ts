export function getDeepValue(obj: any, path: string): any { 
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
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