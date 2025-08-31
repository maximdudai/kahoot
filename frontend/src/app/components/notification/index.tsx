type NotificationProps = {
    message: string;
    type: "success" | "error" | "info";
    duration?: number;
    dismissible?: boolean;
    onClose?: () => void;
}

export const Notification = ({
    message,
    type,
    duration,
    dismissible,
    onClose
}: NotificationProps) => {

    return (
        <div className={`notification ${type}`}>
            <p>{message}</p>
            {dismissible && <button onClick={onClose}>Close</button>}
        </div>
    )
}
