import './notifications.scss';

export class NotificationsService {
    private notifications: HTMLElement[] = [];

    notify(notification: Notification): void {
        if (this.notifications.length >= 3) {
            const oldestNotification = this.notifications.shift();
            if (oldestNotification) {
                document.body.removeChild(oldestNotification);
            }
        }

        const notificationEl = this.createNotificationDom(notification);
        const rootToAppend = notificationEl.querySelector('.title') as HTMLElement;
        const closeBtnEl = this.createNotificationCloseButton(rootToAppend, notification.onClose);

        document.body.appendChild(notificationEl);
        rootToAppend.appendChild(closeBtnEl);

        setTimeout(() => {
            notificationEl.style.opacity = '1';
        }, 0);

        this.notifications.push(notificationEl);

        if (notification.autoCloseOn) {
            setTimeout(() => {
                notificationEl.style.opacity = '0';
                document.body.removeChild(notificationEl);
                this.notifications = this.notifications.filter(t => t !== notificationEl);
            }, notification.autoCloseOn);
        }
    }

    createNotificationDom(notification: Notification) {
        const notificationEl = document.createElement('div');
        notificationEl.innerHTML = `
            <div class="title">
                <div>${notification.title}</div>
            </div>
            <div class="body">${notification.body}</div>`;

        notificationEl.classList.add('notification');
        notificationEl.style.top = `${10 + this.notifications.length * 100}px`; // Changed from bottom to top
        
        const notificationClass = NotificationType[notification.type].toLowerCase().toString();
        notificationEl.classList.add(notificationClass);
        return notificationEl;
    }

    createNotificationCloseButton(notificationEl: HTMLElement, eventCallBack: Function) {
        const closeButtonEl = document.createElement('button');
        closeButtonEl.innerText = 'x';
        closeButtonEl.classList.add('close-button');

        closeButtonEl.onclick = () => {
            notificationEl.style.opacity = '0';
            this.notifications = this.notifications.filter(t => t !== notificationEl.parentElement as HTMLElement);
            document.body.removeChild(notificationEl.parentElement as HTMLElement);
            if (eventCallBack != null) {
                eventCallBack();
            }
        };

        return closeButtonEl;
    }
}

export enum NotificationType {
    Info,
    Success,
    Error,
}

export interface Notification {
    title: string;
    body: string;
    type: NotificationType;
    onClose: Function;
    autoCloseOn?: number;
}