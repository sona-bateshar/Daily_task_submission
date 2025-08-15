// components/ui/form-combobox.tsx

import React, { useState } from 'react';
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";

// Types for the component
export interface ComboboxOption {
  id: string | number;
  label: string;
  description?: string;
  disabled?: boolean;
  [key: string]: any; // Allow additional properties
}

export interface FormComboboxProps {
  // Required props
  options: ComboboxOption[];
  value?: string | number | (string | number)[] | undefined;
  onValueChange: (value: string | number | (string | number)[] | undefined) => void;
  
  // Configuration
  maxSelections?: number; // Default: 1 (single select)
  
  // UI customization
  label?: string;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyMessage?: string;
  
  // Styling
  className?: string;
  disabled?: boolean;
  
  // Advanced options
  searchable?: boolean; // Default: true
  clearable?: boolean; // Default: true for multi-select
  closeOnSelect?: boolean; // Default: true for single, false for multi
  
  // Display options
  showDescription?: boolean; // Default: true
  showSelectedCount?: boolean; // Show count in trigger for multi-select
  maxDisplayedSelections?: number; // Max selections to show as badges
  
  // Custom renderers
  renderOption?: (option: ComboboxOption, isSelected: boolean) => React.ReactNode;
  renderSelection?: (option: ComboboxOption) => React.ReactNode;
}

export const FormCombobox: React.FC<FormComboboxProps> = ({
  options,
  value,
  onValueChange,
  maxSelections = 1,
  label,
  placeholder = "Select option...",
  searchPlaceholder = "Search...",
  emptyMessage = "No options found.",
  className,
  disabled = false,
  searchable = true,
  clearable = maxSelections > 1,
  closeOnSelect = maxSelections === 1,
  showDescription = true,
  showSelectedCount = false,
  maxDisplayedSelections = 3,
  renderOption,
  renderSelection
}) => {
  const [open, setOpen] = useState(false);
  const isMultiSelect = maxSelections > 1;
  
  // Normalize value to always be an array for easier handling
  const selectedValues = Array.isArray(value) ? value : (value !== undefined ? [value] : []);
  const selectedOptions = options.filter(option => selectedValues.includes(option.id));

  // Handle selection
  const handleSelect = (optionId: string | number) => {
    if (disabled) return;

    let newValue: string | number | (string | number)[] | undefined;

    if (isMultiSelect) {
      const currentValues = selectedValues;
      if (currentValues.includes(optionId)) {
        // Remove if already selected
        const filteredValues = currentValues.filter(id => id !== optionId);
        newValue = filteredValues.length > 0 ? filteredValues : undefined;
      } else {
        // Add if not selected (respect max limit)
        if (currentValues.length < maxSelections) {
          newValue = [...currentValues, optionId];
        } else {
          return; // Don't add if at max limit
        }
      }
    } else {
      // Single select
      const isCurrentlySelected = selectedValues.includes(optionId);
      newValue = isCurrentlySelected ? undefined : optionId;
    }

    onValueChange(newValue);
    
    if (closeOnSelect) {
      setOpen(false);
    }
  };

  // Handle clear individual selection (for multi-select)
  const handleClearSelection = (optionId: string | number, event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    if (disabled) return;

    const newValues = selectedValues.filter(id => id !== optionId);
    const result = isMultiSelect ? (newValues.length > 0 ? newValues : undefined) : undefined;
    onValueChange(result);
  };

  // Handle clear all - prevent popover from opening/closing
  const handleClearAll = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    console.log("❌ Clear button clicked");
    if (disabled) return;
    onValueChange(undefined);
  };

  // Render the trigger button content
  const renderTriggerContent = () => {
    if (selectedValues.length === 0) {
      return (
        <span className="text-muted-foreground">{placeholder}</span>
      );
    }

    if (isMultiSelect) {
      if (showSelectedCount && selectedValues.length > maxDisplayedSelections) {
        return (
          <div className="flex items-center gap-1">
            <span>{selectedValues.length} selected</span>
          </div>
        );
      }

      const displayedSelections = selectedOptions.slice(0, maxDisplayedSelections);
      const remainingCount = selectedOptions.length - maxDisplayedSelections;

      return (
        <div className="flex items-center gap-1 flex-wrap">
          {displayedSelections.map(option => (
            <Badge key={option.id} variant="secondary" className="flex items-center gap-1">
              {renderSelection ? renderSelection(option) : option.label}
              {clearable && (
                <X
                  className="h-3 w-3 shrink-0 hover:bg-muted rounded-sm cursor-pointer"
                  onClick={(e) => handleClearSelection(option.id, e)}
                />
              )}
            </Badge>
          ))}
          {remainingCount > 0 && (
            <Badge variant="outline">
              +{remainingCount} more
            </Badge>
          )}
        </div>
      );
    } else {
      // Single select
      const selectedOption = selectedOptions[0];
      return (
        <span>{renderSelection ? renderSelection(selectedOption) : selectedOption?.label}</span>
      );
    }
  };

  // Render individual option
  const renderOptionContent = (option: ComboboxOption) => {
    const isSelected = selectedValues.includes(option.id);
    
    if (renderOption) {
      return renderOption(option, isSelected);
    }

    return (
      <div className="flex items-center w-full">
        <Check
          className={cn(
            "mr-2 h-4 w-4 shrink-0",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">{option.label}</div>
          {showDescription && option.description && (
            <div className="text-sm text-muted-foreground truncate">
              {option.description}
            </div>
          )}
        </div>
        {isMultiSelect && isSelected && (
          <Badge variant="outline" className="ml-2 text-xs">
            Selected
          </Badge>
        )}
      </div>
    );
  };

  return (
    <div className={className}>
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
          {label}
          {maxSelections > 1 && (
            <span className="text-muted-foreground ml-1">
              (max {maxSelections})
            </span>
          )}
        </label>
      )}
      
      <Popover open={open} onOpenChange={setOpen}>
        <div className="relative">
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              disabled={disabled}
              type="button"
              className={cn(
                "w-full justify-between min-h-10 pr-10", // Add right padding for clear button
                selectedValues.length === 0 && "text-muted-foreground",
                isMultiSelect && selectedValues.length > 0 && "h-auto min-h-10 p-2 pr-10"
              )}
            >
              <div className="flex-1 text-left overflow-hidden">
                {renderTriggerContent()}
              </div>
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          
          {/* Clear button positioned absolutely outside the trigger */}
          {clearable && selectedValues.length > 0 && (
            <button
              type="button"
              onClick={handleClearAll}
              disabled={disabled}
              className={cn(
                "absolute right-8 top-1/2 -translate-y-1/2 z-10",
                "h-4 w-4 rounded-sm hover:bg-muted flex items-center justify-center",
                "text-muted-foreground hover:text-foreground transition-colors",
                disabled && "opacity-50 cursor-not-allowed"
              )}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>
        
        <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
          <Command 
            shouldFilter={true}
            filter={(value, search) => {
              console.log("Filtering:", { value, search });
              // Custom filter function to handle the search properly
              if (!search) return 1; // Show all when no search
              
              const searchLower = search.toLowerCase();
              const valueLower = value.toLowerCase();
              
              // Check if search term is found in the value
              const match = valueLower.includes(searchLower) ? 1 : 0;
              console.log("Match result:", match, "for", valueLower, "searching", searchLower);
              return match;
            }}
          >
            {searchable && (
              <CommandInput 
                placeholder={searchPlaceholder}
                onValueChange={(search) => {
                  console.log("Search query:", search);
                  console.log("Available options:", options.map(opt => ({
                    id: opt.id,
                    label: opt.label,
                    description: opt.description
                  })));
                }}
              />
            )}
            <CommandEmpty>{emptyMessage}</CommandEmpty>
            <CommandGroup className="max-h-64 overflow-auto">
              {options.map((option) => {
                // Create a comprehensive search string
                const searchTerms = [
                  option.label,
                  option.description,
                  // Include any additional searchable fields from the original data
                  ...(option.first_name ? [option.first_name] : []),
                  ...(option.middle_name ? [option.middle_name] : []),
                  ...(option.last_name ? [option.last_name] : []),
                  ...(option.email ? [option.email] : [])
                ].filter(Boolean).join(' ').toLowerCase();
                
                return (
                  <CommandItem
                    key={option.id}
                    value={searchTerms}
                    onSelect={() => handleSelect(option.id)}
                    disabled={option.disabled}
                    className="cursor-pointer"
                  >
                    {renderOptionContent(option)}
                  </CommandItem>
                );
              })}
            </CommandGroup>
            
            {/* Footer for multi-select */}
            {isMultiSelect && selectedValues.length > 0 && clearable && (
              <div className="border-t p-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onValueChange(undefined);
                  }}
                  className="w-full"
                >
                  Clear All ({selectedValues.length})
                </Button>
              </div>
            )}
          </Command>
        </PopoverContent>
      </Popover>
      
      {/* Selected count info for multi-select */}
      {isMultiSelect && selectedValues.length > 0 && (
        <div className="text-xs text-muted-foreground mt-1">
          {selectedValues.length} of {maxSelections} selected
        </div>
      )}
    </div>
  );
};

// Hook for easier integration with react-hook-form
export const useFormCombobox = (
  name: string,
  control: any,
  options: ComboboxOption[],
  props?: Partial<FormComboboxProps>
) => {
  return {
    name,
    control,
    render: ({ field }: any) => (
      <FormCombobox
        options={options}
        value={field.value}
        onValueChange={field.onChange}
        {...props}
      />
    )
  };
};



