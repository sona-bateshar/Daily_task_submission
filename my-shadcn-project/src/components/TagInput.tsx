import React, { useState, KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';
import {IconPlus } from "@tabler/icons-react";

interface TagInputProps {
  label?: string;
  placeholder?: string;
  initialTags?: string[];
  onTagsChange?: (tags: string[]) => void;
  maxTags?: number;
  className?: string;
}

const TagInput: React.FC<TagInputProps> = ({
  placeholder = "Add an item...",
  initialTags = [],
  onTagsChange,
  maxTags,
  className = ""
}) => {
  const [tags, setTags] = useState<string[]>(initialTags);
  const [inputValue, setInputValue] = useState("");

  // Call external callback if provided
  const updateTags = (newTags: string[]) => {
    setTags(newTags);
    if (onTagsChange) {
      onTagsChange(newTags);
    }
  };

  const addTag = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue && !tags.includes(trimmedValue)) {
      if (!maxTags || tags.length < maxTags) {
        const newTags = [...tags, trimmedValue];
        updateTags(newTags);
        setInputValue("");
      }
    }
  };

  const removeTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag !== tagToRemove);
    updateTags(newTags);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  return (
    <div className={`space-y-3 ${className}`}>
      
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="flex-1 bg-background border-input"
        />
        
        <Button 
          onClick={addTag}
          disabled={!inputValue.trim() || (maxTags ? tags.length >= maxTags : false)}
          className="px-4"
          variant="secondary"
        >
          <IconPlus/>
        </Button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, index) => (
            <div
              key={index}
              className="inline-flex items-center gap-1 bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
            >
              <span>{tag}</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTag(tag)}
                className="h-auto p-0 w-4 h-4 hover:bg-secondary-foreground/20"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Demo component to show usage
const TagInputDemo = () => {
  // Example 1: Simple usage (component manages state internally)
  const handleTagsChange = (tags: string[]) => {
    console.log('Tags changed:', tags);
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-background rounded-lg border space-y-6">
      {/* Simple usage - just pass initial tags */}
      <TagInput
        label="Actions Required"
        placeholder="Add an action item..."
        initialTags={['haha', 'haha']}
        onTagsChange={handleTagsChange} // Optional: get updates
        maxTags={10}
      />
      
      {/* Even simpler - no initial tags */}
      <TagInput
        label="Todo Items"
        placeholder="Add a todo..."
      />
    </div>
  );
};

export default TagInput;