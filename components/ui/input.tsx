import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(({ className, type, ...props }, ref) => (
  <input type={type} className={cn("flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-950 shadow-sm transition-colors placeholder:text-slate-400 focus-visible:border-blue-600 focus-visible:outline-2 focus-visible:outline-blue-100 disabled:cursor-not-allowed disabled:opacity-50", className)} ref={ref} {...props} />
));
Input.displayName = "Input";

export { Input };
