import { ChangeDetector } from "../../../framework/ui/change-detector";
import { Component } from "../../../framework/ui/component";
import { Notification, NotificationsService, NotificationType } from "../../services/notifications/notifications.service";
import html from './notifications-sample.component.html';
import './notifications-sample.component.scss';

@Component({
    name: 'NotificationsSampleComponent',
    html: html
})
export class NotificationsSampleComponent  {
    constructor(private changeDetector: ChangeDetector, private notifications: NotificationsService) {
    }
    
    onCreateInfoMessage() {
        const notification = {
            title: 'Info',
            body: 'I am info notification message!',
            type: NotificationType.Info,
            onClose: () => {
                console.log('Notification closed.');
            }
        } as Notification;
        this.notifications.notify(notification);
    }

    onCreateSuccessMessage() {
        const notification = {
            title: 'Success',
            body: 'I am success notification message!',
            type: NotificationType.Success
        } as Notification;
        this.notifications.notify(notification);
    }

    onCreateErrorMessage() {
        const notification = {
            title: 'Error',
            body: 'I am error notification message! Delay is 3 seconds...',
            type: NotificationType.Error,
            autoCloseOn: 3000
        } as Notification;
        this.notifications.notify(notification);
    }
}