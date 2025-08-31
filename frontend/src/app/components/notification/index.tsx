import { memo, useEffect, useMemo, useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";
import { styleByPosition, styleByType } from "./tools";
import { NotificationPosition, NotificationProps } from "./types";

export const Notification = memo(({
    message,
    type,
    duration = 3000,
    position = NotificationPosition.TOP_RIGHT,
    dismissible,
    onClose
}: NotificationProps) => {
    const notificationType = useMemo(() => styleByType(type), [type]);
    const notificationPosition = useMemo(() => styleByPosition(position), [position]);
    const [isVisible, setIsVisible] = useState<boolean>(true);

    const onCloseNotification = () => {
        if(onClose) 
            return onClose();

        setIsVisible(false);
    };

    useEffect(() => {
        const hideTimer = duration ? setTimeout(() => setIsVisible(false), duration) : null;

        return () => {
            if (hideTimer) {
                clearTimeout(hideTimer);
            }
        };
    }, [duration]);


    return isVisible && (
        <div className={`notification w-96 p-2 rounded-md flex items-center justify-between fixed m-2 ${notificationType} ${notificationPosition}`}>
            <p>{message}</p>
            {dismissible && <button onClick={onCloseNotification}>
                <IoCloseCircleOutline />
            </button>}
        </div>
    )
});
