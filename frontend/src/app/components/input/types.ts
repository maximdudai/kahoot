export type InputType = {
    id: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    hasError: boolean;
    maxLength: number;
    Icon: React.ElementType;
}