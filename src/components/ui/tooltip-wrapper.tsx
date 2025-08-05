import { TooltipContent } from "@radix-ui/react-tooltip";
import { Tooltip, TooltipTrigger } from "./tooltip";
import { ReactNode } from "react";



type TooltipWrapperProps = {
  text: string;
  children: ReactNode;
};



export function TooltipWrapper({ text, children }:TooltipWrapperProps){
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent>
        <p>{text}</p>
      </TooltipContent>
    </Tooltip>
  )
}