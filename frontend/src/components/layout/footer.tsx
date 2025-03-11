import { useTheme } from "@/components/context/theme-provider";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

export const Footer = () => {
  const { setTheme, theme } = useTheme();

  return (
    <footer className="w-full p-6 md:p-10">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between">
        <p className="text-foreground text-sm font-normal">
          Copyright © 2025 DevTalk. All rights reserved.
        </p>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          {theme === "dark" ? (
            <Icons.sun className="size-4" />
          ) : (
            <Icons.moon className="size-4" />
          )}
        </Button>
      </div>
    </footer>
  );
};
