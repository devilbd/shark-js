export class NotificationsService {
    private toasters: HTMLElement[] = [];

    sendNotification(message: string): void {
        this.createToaster(message);
    }

    private createToaster(message: string): void {
        if (this.toasters.length >= 3) {
            const oldestToaster = this.toasters.shift();
            if (oldestToaster) {
                document.body.removeChild(oldestToaster);
            }
        }

        const toaster = this.createToasterDom(message);
        const closeBtn = this.createToasterCloseButton(toaster)       

        toaster.appendChild(closeBtn);
        document.body.appendChild(toaster);

        setTimeout(() => {
            toaster.style.opacity = '1';
        }, 0);

        this.toasters.push(toaster);

        setTimeout(() => {
            toaster.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toaster);
                this.toasters = this.toasters.filter(t => t !== toaster);
            }, 500);
        }, 3000);
    }

    createToasterDom(message: string) {
        const toaster = document.createElement('div');
        toaster.innerText = message;
        toaster.style.top = `${10 + this.toasters.length * 50}px`; // Changed from bottom to top
        toaster.classList.add('toaster-notification');
        return toaster;
    }

    createToasterCloseButton(toaster: HTMLElement) {
        const closeButton = document.createElement('button');
        closeButton.innerText = 'x';
        closeButton.classList.add('close-button');

        closeButton.onclick = () => {
            toaster.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(toaster);
                this.toasters = this.toasters.filter(t => t !== toaster);
            }, 500);
        };
        return closeButton;
    }
}
