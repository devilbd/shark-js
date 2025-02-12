export function draggable(componentRef: HTMLElement) {
    const parentElement = componentRef.parentElement;
    const handle = componentRef.querySelector('.handle') as HTMLElement || componentRef;

    parentElement?.removeChild(componentRef);    
    document.body.appendChild(componentRef);

    if (handle != null) {
        handle.addEventListener('mousedown', (event) => {
            let offsetX = event.clientX - componentRef.getBoundingClientRect().left;
            let offsetY = event.clientY - componentRef.getBoundingClientRect().top;
            handle.style.cursor = 'grabbing';
    
            const onMouseMove = (moveEvent: MouseEvent) => {
                let newLeft = moveEvent.clientX - offsetX;
                let newTop = moveEvent.clientY - offsetY;

                // Ensure the element stays within the document borders
                const rect = componentRef.getBoundingClientRect();
                const docWidth = document.documentElement.clientWidth;
                const docHeight = document.documentElement.clientHeight;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + rect.width > docWidth) newLeft = docWidth - rect.width;
                if (newTop + rect.height > docHeight) newTop = docHeight - rect.height;

                componentRef.style.left = `${newLeft}px`;
                componentRef.style.top = `${newTop}px`;
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
    
            const onTouchMove = (moveEvent: any) => {
                const moveTouch = moveEvent.touches[0];
                let newLeft = moveTouch.clientX - offsetX;
                let newTop = moveTouch.clientY - offsetY;

                // Ensure the element stays within the document borders
                const rect = componentRef.getBoundingClientRect();
                const docWidth = document.documentElement.clientWidth;
                const docHeight = document.documentElement.clientHeight;

                if (newLeft < 0) newLeft = 0;
                if (newTop < 0) newTop = 0;
                if (newLeft + rect.width > docWidth) newLeft = docWidth - rect.width;
                if (newTop + rect.height > docHeight) newTop = docHeight - rect.height;

                componentRef.style.left = `${newLeft}px`;
                componentRef.style.top = `${newTop}px`;
            };
    
            const onTouchEnd = () => {
                document.removeEventListener('touchmove', onTouchMove);
                document.removeEventListener('touchend', onTouchEnd);
                handle.style.cursor = 'grab';
            };
    
            document.addEventListener('touchmove', onTouchMove);
            document.addEventListener('touchend', onTouchEnd);
        });
    }
}