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

export default function OrganizationButton() {
  const { data: organizations } = authClient.useListOrganizations();
  const { data: activeOrganization } = authClient.useActiveOrganization();
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[200px] justify-between"
          >
            {activeOrganization?.name}
            <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search Organization..." />
            <CommandList>
              <CommandEmpty>No Organizations found.</CommandEmpty>
              <CommandGroup>
                {organizations?.map((organization) => (
                  <CommandItem
                    key={organization.id}
                    value={organization.name}
                    onSelect={async () => {
                      console.log(activeOrganization);

                      await authClient.organization.setActive({
                        organizationId: organization.id!,
                        organizationSlug: organization.slug!,
                      });
                      setOpen(false);
                    }}
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
    </>
  );
}
