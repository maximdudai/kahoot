import { InputType } from "./types";

export const Input = ({ id,
    placeholder,
    value,
    onChange,
    hasError,
    maxLength,
    Icon
}: InputType) => {
    return (
        <div
            className={`font-bold text-xl p-2 flex items-center justify-between border-8 
                ${!hasError ? "border-green-500" : "border-red-500 animate-pulse"} 
                rounded-full`
            }
        >
            <input
                className="bg-transparent w-full text-white placeholder:text-white px-2 focus:outline-none focus:placeholder:text-gray-400"
                type="text"
                id={id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                maxLength={maxLength}
                required
            />
            <Icon className={`w-10 h-full ${!hasError ? "text-green-500" : "text-red-500"}`} />
        </div>
    );
}
