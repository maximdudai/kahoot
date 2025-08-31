import { InputTypeProps } from "./types";
import classnames from "classnames";
import { memo } from "react";

export const Input = memo(({
    id,
    name,
    className,
    type,
    placeholder,
    value,
    hasError,
    maxLength,
    Icon,
    acceptFileTypes,
    required,
    onChange,
    onInput,
    onBlur,
    onKeyDown
}: InputTypeProps) => {
    return (
        <div
            className={`font-bold text-xl p-2 flex items-center justify-between border-8 
                ${!hasError ? "border-green-500" : "border-red-500 animate-pulse"} 
                rounded-full`
            }
        >
            <input
                className={classnames(
                    className, "bg-transparent w-full text-white placeholder:text-white px-2 focus:outline-none focus:placeholder:text-gray-400",
                    { "border-red-500": hasError }
                )}
                type={type}
                name={name}
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onInput={onInput}
                onBlur={onBlur}
                maxLength={maxLength}
                onKeyDown={onKeyDown}
                checked={type === "radio" ? value === "on" : undefined}
                accept={Array.isArray(acceptFileTypes) ? acceptFileTypes.join(",") : acceptFileTypes}
                required={required}
            />
            <Icon className={`w-10 h-full ${!hasError ? "text-green-500" : "text-red-500"}`} />
        </div>
    );
});
