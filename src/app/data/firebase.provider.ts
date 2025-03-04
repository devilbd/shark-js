import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, get, child } from 'firebase/database';

export class FirebaseProvider {
    private database: any;

    constructor() {
        const j = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiJBSXphU3lDOWNVS1c1R3lhNzN4b1I2UnE4QVZTb0N3aFBZWjhiOEkiLCJhdXRoRG9tYWluIjoic2hhcmstanMuZmlyZWJhc2VhcHAuY29tIiwiZGF0YWJhc2VVUkwiOiJodHRwczovL3NoYXJrLWpzLWRlZmF1bHQtcnRkYi5ldXJvcGUtd2VzdDEuZmlyZWJhc2VkYXRhYmFzZS5hcHAiLCJwcm9qZWN0SWQiOiJzaGFyay1qcyIsInN0b3JhZ2VCdWNrZXQiOiJzaGFyay1qcy5maXJlYmFzZXN0b3JhZ2UuYXBwIiwibWVzc2FnaW5nU2VuZGVySWQiOiIxMDQ0ODE1NTU3MTgxIiwiYXBwSWQiOiIxOjEwNDQ4MTU1NTcxODE6d2ViOjhmNDNlYzBiMjIzZWRkNjgwZTcwNTQiLCJtZWFzdXJlbWVudElkIjoiRy04UUpXWkJRR0hKIn0.g1iiLTzYtRqWQl58yuy5vWjKUuc1TL0IOHP-jyM7Rcg";
        const config = JSON.parse(atob(j.split('.')[1]));
        const app = initializeApp(config);
        this.database = getDatabase(app);
    }

    async getSampleComponent(componentSample: string) {
        return new Promise((resolve, reject) => {
            const dbRef = ref(this.database);
            get(child(dbRef, `sampleComponents/${componentSample}`)).then(async (snapshot) => {
                let val = snapshot.val();
                val.html = this.beautifyHtml(val.html);
                val.ts = this.beautifyTypeScript(val.ts);
                
                val.sass = val.sass;
                resolve(val);
            }).catch((error: any) => {
                console.log(error);
                reject(error);
            });
        });
    }

    beautifyHtml(value: string) {
        // Replace multiple spaces and new lines with single spaces
        value = value.replace(/\s+/g, ' ');

        // Add new lines before opening tags and after closing tags
        let beautifiedHtml = value.replace(/(>)\s*(<)/g, '$1\n$2');

        // Add indentation
        let indentLevel = 0;
        beautifiedHtml = beautifiedHtml.replace(/(<\/?[^>]+>)/g, (match) => {
            if (match.startsWith('</')) {
                indentLevel--;
            }
            let indent = '  '.repeat(indentLevel);
            if (!match.startsWith('</') && !match.endsWith('/>')) {
                indentLevel++;
            }
            return `${indent}${match}`;
        });

        return beautifiedHtml;
    }

    beautifyTypeScript = (code: string): string => {
        // Step 1: Remove all whitespace characters
        code = code.replace(/\s+/g, '');
    
        // Regular expressions for adding spaces and new lines
        const regexPatterns = [
            { pattern: /(;)/g, replacement: '$1\n' }, // Add newline after semicolons
            { pattern: /(\{)/g, replacement: ' $1\n' }, // Add space and newline after opening braces
            { pattern: /(\})/g, replacement: '\n$1\n' }, // Add newline before closing braces
            { pattern: /(\b(?:if|for|while|switch|catch|finally|function|return|const|let|var|class)\b)/g, replacement: '\n$1 ' }, // Add newline before specific keywords
            { pattern: /([^\n])(\b(?:else|else\s*if|do|try|catch|finally)\b)/g, replacement: '$1\n$2 ' }, // Add newline before else, else if, do, try, catch, finally
            { pattern: /(\n\s*\n)+/g, replacement: '\n' }, // Remove extra newlines
        ];
    
        // Apply regular expressions
        let beautifiedCode = code;
        for (const { pattern, replacement } of regexPatterns) {
            beautifiedCode = beautifiedCode.replace(pattern, replacement);
        }
    
        // Indentation logic
        const indent = '    '; // 4 spaces
        let indentLevel = 0;
        const lines = beautifiedCode.split('\n');
        beautifiedCode = lines
            .map((line) => {
                if (line.includes('}')) {
                    indentLevel--;
                }
                const indentedLine = indent.repeat(Math.max(indentLevel, 0)) + line.trim(); // Ensure indentLevel is non-negative
                if (line.includes('{')) {
                    indentLevel++;
                }
                return indentedLine;
            })
            .join('\n');
    
        return beautifiedCode.trim();
    };
}
