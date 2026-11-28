import * as React from "react";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  size?: "sm" | "md";
  iconStart?: React.ReactNode;
  iconEnd?: React.ReactNode;
};

const sizes = {
  sm: "text-sm leading-5 px-3 py-1.5",
  md: "text-base leading-6 px-4 py-2",
};

export function Button({ size = "md", iconStart, iconEnd, children, className = "", ...rest }: Props) {
  return (
    <button
      className={`btn inline-flex items-center rounded-full bg-zinc-800 text-white ${sizes[size]} ${className}`}
      {...rest}
    >
      {iconStart ? <span className="icon mr-2 size-[1lh]">{iconStart}</span> : null}
      {children}
      {iconEnd ? <span className="icon ml-2 size-[1lh]">{iconEnd}</span> : null}
    </button>
  );
}
