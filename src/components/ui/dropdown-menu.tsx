"use client";

import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

export const DropdownMenuRoot = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
export const DropdownMenuPortal = Menu.Portal;
export const DropdownMenuPositioner = Menu.Positioner;

function DropdownMenuPopup({
  className,
  ...props
}: Menu.Popup.Props) {
  return (
    <Menu.Popup
      className={cn(
        "z-50 min-w-[8rem] rounded-lg border border-border bg-background p-1 shadow-md",
        className,
      )}
      {...props}
    />
  );
}

function DropdownMenuItem({
  className,
  ...props
}: Menu.Item.Props) {
  return (
    <Menu.Item
      className={cn(
        "flex w-full cursor-pointer select-none items-center rounded-md px-3 py-1.5 text-sm outline-none hover:bg-muted data-[highlighted]:bg-muted",
        className,
      )}
      {...props}
    />
  );
}

export { DropdownMenuPopup, DropdownMenuItem };
