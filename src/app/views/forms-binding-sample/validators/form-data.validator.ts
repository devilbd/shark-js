export class FormDataValidator {
    isValidNumber(data: any) {
        const result = { 
            invalid: true,
            error: 'Number should be bigger than 5!'
         };

         if (parseFloat(data.customNumberValue) < 5) {
            return result;
         }

         return null;
    }
}