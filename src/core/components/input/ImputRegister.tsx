import { Box } from "@mui/material";
import React from "react";

interface Props {
    value: string
    onChange: (e: any) => void;
    type: "text" | "password";
    placeholder?: string;
}

export default function InputRegister({ type, value, onChange, placeholder }: Props) {

    return (
        <input
            type={type}
            value={value}
            onChange={e => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
}