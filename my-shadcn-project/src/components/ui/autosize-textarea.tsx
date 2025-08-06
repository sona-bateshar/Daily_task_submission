import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useAutosizeTextArea } from "../../hooks/use-autosize-textarea"

interface AutoSizeTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  showFileList?: boolean
}

export function AutoSizeTextarea({
  className,
  showFileList = false,
  ...props
}: AutoSizeTextareaProps) {
  const textAreaRef = useRef<HTMLTextAreaElement>(null)
  const [textAreaHeight, setTextAreaHeight] = useState<number>(0)

  useEffect(() => {
    if (textAreaRef.current) {
      setTextAreaHeight(textAreaRef.current.offsetHeight)
    }
  }, [props.value])

  useAutosizeTextArea({
    ref: textAreaRef as React.RefObject<HTMLTextAreaElement>,
    maxHeight: 240,
    borderWidth: 1,
    dependencies: [props.value, showFileList],
  })

  return (
    <textarea
      ref={textAreaRef}
      className={cn(
        "min-h-[6.75rem]", 
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        showFileList && "pb-16",
        className
      )}
      {...props}
    />
  )
}
