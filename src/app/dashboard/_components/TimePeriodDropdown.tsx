import React from 'react';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ChevronsUpDown, Check } from 'lucide-react';
import { Command, CommandList, CommandGroup, CommandItem } from '@/components/ui/command';
import { cn } from '@/lib/utils';

interface TimePeriodDropdownProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: string;
  setValue: (value: string) => void;
  timePeriod: { value: string; label: string }[];
}

const TimePeriodDropdown: React.FC<TimePeriodDropdownProps> = ({ open, setOpen, value, setValue, timePeriod }) => {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[250px] h-[48px] justify-between bg-[#FCB6D7] rounded-xl hover:bg-[#FCE4EC]"
        >
          {value
            ? timePeriod.find((period) => period.value === value)?.label
            : "Select Time Period"}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandList>
            <CommandGroup>
              {timePeriod.map((period) => (
                <CommandItem
                  key={period.value}
                  value={period.value}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === period.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {period.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default TimePeriodDropdown;