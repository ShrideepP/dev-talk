import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Popover, PopoverTrigger, PopoverContent } from "./ui/popover";
import { Button } from "./ui/button";
import { Icons } from "./icons";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "./ui/command";
import { cn } from "@/lib/utils";

export const Categories = ({
  categories,
}: {
  categories: Category[] | undefined;
}) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  const navigate = useNavigate();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full max-w-56 min-w-fit justify-between"
        >
          {value
            ? categories?.find((category) => category.slug === value)?.name
            : "Categories"}
          <Icons.chevronsUpDown className="size-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-full max-w-56 min-w-fit p-0">
        <Command>
          <CommandInput placeholder="Search category..." />
          <CommandList>
            <CommandEmpty>No category found.</CommandEmpty>
            <CommandGroup>
              {categories?.map((category) => (
                <CommandItem
                  key={category.id}
                  value={category.slug}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                    navigate({
                      to: "/",
                      search: {
                        page: 1,
                        category:
                          currentValue !== value ? category.slug : undefined,
                      },
                    });
                  }}
                >
                  <Icons.check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === category.slug ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {category.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
