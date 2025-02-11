export function draggable(componentRef: HTMLElement) {
    const parentElement = componentRef.parentElement;
    const handle = componentRef.querySelector('.handle') as HTMLElement;
    parentElement?.removeChild(componentRef);    
    document.body.appendChild(componentRef);
    if (handle != null) {
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
    
        handle.addEventListener('touchstart', (event) => {
            event.preventDefault();
            event.stopPropagation();
            
            const touch = event.touches[0];
            let offsetX = touch.clientX - componentRef.getBoundingClientRect().left;
            let offsetY = touch.clientY - componentRef.getBoundingClientRect().top;
            handle.style.cursor = 'grabbing';
    
            const onTouchMouve = (moveEvent: any) => {
                const moveTouch = moveEvent.touches[0];
                componentRef.style.left = `${moveTouch.clientX - offsetX}px`;
                componentRef.style.top = `${moveTouch.clientY - offsetY}px`;
            };
    
            const onTouchEnd = () => {
                document.removeEventListener('touchmove', onTouchMouve);
                document.removeEventListener('touchend', onTouchEnd);
                handle.style.cursor = 'grab';
            };
    
            document.addEventListener('touchmove', onTouchMouve);
            document.addEventListener('touchend', onTouchEnd);
        });
    }
}