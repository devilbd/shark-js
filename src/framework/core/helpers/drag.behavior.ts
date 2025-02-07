export function draggable(componentRef: HTMLElement) {

    const parentElement = componentRef.parentElement;
    parentElement?.removeChild(componentRef);    
    document.body.appendChild(componentRef);
    const handle = componentRef.querySelector('.handle') as HTMLElement;

    handle.addEventListener('mousedown', (event) => {
        let offsetX = event.clientX - componentRef.getBoundingClientRect().left;
        let offsetY = event.clientY - componentRef.getBoundingClientRect().top;
        handle.style.cursor = 'grabbing';

        const onMouseMove = (moveEvent: MouseEvent) => {
            componentRef.style.left = `${moveEvent.clientX - offsetX}px`;
            componentRef.style.top = `${moveEvent.clientY - offsetY}px`;
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
            handle.style.cursor = 'grab';
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    });
}