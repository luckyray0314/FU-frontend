import { Box } from "@mui/material";
import React from "react";

interface Props {
  value: string;
  onChange: (e: any) => void;
  iconSrc: string;
  type: "text" | "password";
  placeholder?: string;
  onBlur: () => void;
}

export default function InputWithIcon({ iconSrc, type, value, onChange, onBlur, placeholder }: Props) {

  return (
    <Box className="bg-white w-full px-[35px] py-[16px] flex align-center gap-[16px]" sx={{
      boxShadow: "0px 4px 24px rgb(0 0 0 / 5%)",
      borderRadius: "999px"
    }}>
      <img src={iconSrc} alt="icon" width={28} height={22} />
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        className="flex-1 border-none focus-visible:outline-none text-[18px]" 
      />
    </Box>
  );
}