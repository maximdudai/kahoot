import { NotificationPosition, NotificationProps } from "./types";

export const styleByType = (type: NotificationProps['type']) => {
    switch (type) {
        case "success":
            return "bg-green-500 text-white";
        case "error":
            return "bg-red-500 text-white";
        case "info":
            return "bg-blue-500 text-white";
        default:
            return "";
    }
};

export const styleByPosition = (pos: NotificationPosition) => {
    switch (pos) {
        case "top-left":
            return "top-0 left-0";
        case "top-right":
            return "top-0 right-0";
        case "bottom-left":
            return "bottom-0 left-0";
        case "bottom-right":
            return "bottom-0 right-0";
        default:
            return "";
    }
};