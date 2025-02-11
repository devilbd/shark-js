import { Component } from "../../../framework/ui/component";
import html from './analogue-clock.component.html';
import './analogue-clock.component.scss';

@Component({
    name: 'AnalogueClockComponent',
    html: html
})
export class AnalogueClockComponent {
    constructor() {
        setTimeout(() => {
            this.startClock();
        }, 500);
    }

    startClock(): void {
        const currentSec = this.getSecondsToday();
        const seconds = (currentSec / 60) % 1;
        const minutes = (currentSec / 3600) % 1;
        const hours = (currentSec / 43200) % 1;
        this.setTime(60 * seconds, "second");
        this.setTime(3600 * minutes, "minute");
        this.setTime(43200 * hours, "hour");
    }

    setTime(left, hand) {
        const el = document.querySelector('.clock__' + hand) as HTMLElement;
        if (el != null) {
            el.style.animationDelay = left * -1 + 's';
        }
    }
    
    getSecondsToday() {
        let now: any = new Date();

        let today: any = new Date(now.getFullYear(), now.getMonth(), now.getDate());

        let diff = now - today;
        return Math.round(diff / 1000);
    }
        
}
