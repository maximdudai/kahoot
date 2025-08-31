export enum InputType {
    Text = "text",
    Password = "password",
    Email = "email",
    Number = "number",
    File = "file",
    Radio = "radio"
}
export type InputTypeProps = {
    name?: string;
    className?: string;
    type?: InputType;
    id?: string;
    placeholder?: string;
    value?: string;
    hasError?: boolean;
    maxLength?: number;
    checked?: boolean;
    acceptFileTypes?: string | string[];
    required?: boolean;
    Icon?: React.ElementType;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onInput?: (e: React.FormEvent<HTMLInputElement>) => void;
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}