"use client";

import { authClient } from "@/lib/auth-client";
import React from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export default function OrganizationButton() {
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleOrganizationSelect = async (organization: any) => {
    if (organization.id === activeOrganization?.id) {
      setOpen(false);
      return;
    }
    setIsLoading(true);
    try {
      await authClient.organization.setActive({
        organizationId: String(organization.id),
      });
      setOpen(false);
      toast.success(`Switched to ${organization.name}`);
    } catch (error) {
      toast("An error has occured. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
          disabled={isLoading}
        >
          {activeOrganization?.name || "Select Organization"}
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search Organization..." />
          <CommandList>
            <CommandEmpty>No Organizations found.</CommandEmpty>
            <CommandGroup>
              {organizations?.map((organization: any) => (
                <CommandItem
                  key={organization.id}
                  value={organization.name}
                  onSelect={() => handleOrganizationSelect(organization)}
                  disabled={isLoading}
                >
                  <CheckIcon
                    className={cn(
                      "mr-2 h-4 w-4",
                      organization.id === activeOrganization?.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {organization.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
