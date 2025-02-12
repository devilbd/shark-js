import { ChangeDetector } from "../../../framework/ui/change-detector";
import { Component } from "../../../framework/ui/component";
import { NotificationsService, NotificationType } from "../../services/notifications/notifications.service";
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
        this.notifications.sendNotification('I am toaster message!', NotificationType.Info);
    }

    onCreateSuccessMessage() {
        this.notifications.sendNotification('I am toaster message!', NotificationType.Success);
    }

    onCreateErrorMessage() {
        this.notifications.sendNotification('I am toaster message!', NotificationType.Error);
    }
}