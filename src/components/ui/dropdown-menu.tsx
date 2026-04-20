"use client";

import { Menu } from "@base-ui/react/menu";
import { cn } from "@/lib/utils";

function DropdownMenuRoot({ ...props }: Menu.Root.Props) {
  return <Menu.Root {...props} />;
}

function DropdownMenuTrigger({ ...props }: Menu.Trigger.Props) {
  return <Menu.Trigger {...props} />;
}

function DropdownMenuPortal({ ...props }: Menu.Portal.Props) {
  return <Menu.Portal {...props} />;
}

function DropdownMenuPositioner({ ...props }: Menu.Positioner.Props) {
  return <Menu.Positioner {...props} />;
}

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

export {
  DropdownMenuRoot,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuPositioner,
  DropdownMenuPopup,
  DropdownMenuItem,
};
