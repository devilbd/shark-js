export class FormDataValidator {
    isValidNumber(customNumberValue: number) {
        const result = { 
            invalid: true,
            error: 'Number should be bigger than 5!'
         };

         if (customNumberValue < 5) {
            return result;
         }

         return null;
    }
}