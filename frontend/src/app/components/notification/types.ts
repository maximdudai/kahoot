
export enum NotificationType {
    SUCCESS = "success",
    ERROR = "error",
    INFO = "info"
}

export enum NotificationPosition {
    TOP_LEFT = "top-left",
    TOP_RIGHT = "top-right",
    BOTTOM_LEFT = "bottom-left",
    BOTTOM_RIGHT = "bottom-right"
}

export type NotificationProps = {
    message: string;
    type: NotificationType;
    position?: NotificationPosition;
    duration?: number;
    dismissible?: boolean;
    onClose?: () => void;
}