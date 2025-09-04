"use client"

import * as React from "react"
import { Calendar as CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { DayPickerProps } from "react-day-picker"

interface Calendar28Props extends React.InputHTMLAttributes<HTMLInputElement> {
  disabledDates?: DayPickerProps["disabled"]
  placeholder?: string
}

// Helper function to format date for display (dd-mm-yyyy)
const formatDateForDisplay = (date: Date | undefined): string => {
  if (!date) return ""
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  
  return `${day}-${month}-${year}`
}

// Helper function to format date for form value (yyyy-mm-dd)
const formatDateForValue = (date: Date | undefined): string => {
  if (!date) return ""
  
  const day = date.getDate().toString().padStart(2, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const year = date.getFullYear()
  
  return `${year}-${month}-${day}`
}

// Helper function to check if a date is valid
const isValidDate = (date: Date): boolean => {
  return date instanceof Date && !isNaN(date.getTime())
}

// Helper function to parse dd-mm-yyyy format (for user input)
const parseDateFromDisplay = (dateString: string): Date | null => {
  const parts = dateString.split('-')
  if (parts.length !== 3) return null
  
  const day = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
  const year = parseInt(parts[2], 10)
  
  const date = new Date(year, month, day)
  
  // Validate that the parsed date matches the input
  if (
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year &&
    isValidDate(date)
  ) {
    return date
  }
  
  return null
}

// Helper function to parse yyyy-mm-dd format (from form value)
const parseDateFromValue = (dateString: string): Date | null => {
  const parts = dateString.split('-')
  if (parts.length !== 3) return null
  
  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
  const day = parseInt(parts[2], 10)
  
  const date = new Date(year, month, day)
  
  // Validate that the parsed date matches the input
  if (
    date.getDate() === day &&
    date.getMonth() === month &&
    date.getFullYear() === year &&
    isValidDate(date)
  ) {
    return date
  }
  
  return null
}

const Calendar28 = React.forwardRef<HTMLInputElement, Calendar28Props>(
  ({ disabledDates, placeholder = "Pick a date", value, onChange, onKeyDown, ...props }, ref) => {
    const [open, setOpen] = React.useState(false)
    
    // Parse initial date from value (yyyy-mm-dd format)
    const initialDate = value ? parseDateFromValue(value.toString()) : undefined
    const [date, setDate] = React.useState<Date | undefined>(initialDate)
    const [month, setMonth] = React.useState<Date>(initialDate || new Date())
    const [inputValue, setInputValue] = React.useState(
      formatDateForDisplay(initialDate)
    )

    // Sync with external value changes
    React.useEffect(() => {
      const currentFormattedValue = formatDateForValue(date)
      if (value !== currentFormattedValue) {
        if (value) {
          const newDate = parseDateFromValue(value.toString())
          setDate(newDate || undefined)
          setInputValue(formatDateForDisplay(newDate || undefined))
          if (newDate) setMonth(newDate)
        } else {
          setDate(undefined)
          setInputValue("")
        }
      }
    }, [value, date])

    const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate)
      const displayDate = formatDateForDisplay(selectedDate)
      const valueDate = formatDateForValue(selectedDate)
      setInputValue(displayDate)
      
      if (selectedDate) {
        setMonth(selectedDate)
      }
      
      // Dispatch change event with yyyy-mm-dd format for form
      if (onChange) {
        const event = {
          target: { value: valueDate },
          type: 'change'
        } as React.ChangeEvent<HTMLInputElement>
        onChange(event)
      }
      
      setOpen(false)
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value
      setInputValue(newValue)
      
      // Try to parse the date from display format (dd-mm-yyyy)
      const parsedDate = parseDateFromDisplay(newValue)
      if (parsedDate) {
        setDate(parsedDate)
        setMonth(parsedDate)
        
        // Call onChange with yyyy-mm-dd format
        if (onChange) {
          const valueDate = formatDateForValue(parsedDate)
          const event = {
            target: { value: valueDate },
            type: 'change'
          } as React.ChangeEvent<HTMLInputElement>
          onChange(event)
        }
      } else if (newValue === "") {
        setDate(undefined)
        // Call onChange with empty value
        if (onChange) {
          const event = {
            target: { value: "" },
            type: 'change'
          } as React.ChangeEvent<HTMLInputElement>
          onChange(event)
        }
      }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "ArrowDown") {
        e.preventDefault()
        setOpen(true)
      }
      
      if (onKeyDown) {
        onKeyDown(e)
      }
    }

    const handleQuickSelect = (daysToAdd: number) => {
      const newDate = new Date()
      newDate.setDate(newDate.getDate() + daysToAdd)
      handleDateSelect(newDate)
    }

    const quickSelectButtons = [
      { label: "Today", days: 0 },
      { label: "Tomorrow", days: 1 },
      { label: "In 3 days", days: 3 },
      { label: "In a week", days: 7 },
      { label: "In 2 weeks", days: 14 }
    ]

    return (
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="bg-background pr-10"
        />
        
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-1/2 right-2 size-6 -translate-y-1/2 hover:bg-transparent"
              type="button"
            >
              <CalendarIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          
          <PopoverContent 
            className="w-auto p-0" 
            align="end" 
            alignOffset={-8} 
            sideOffset={10}
          >
            <Card className="max-w-[300px] border-none shadow-none">
              <CardContent className="p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  month={month}
                  onMonthChange={setMonth}
                  disabled={disabledDates}
                  captionLayout="dropdown"
                  className="bg-transparent p-0 [--cell-size:--spacing(9.5)]"
                  initialFocus
                />
              </CardContent>
              
              <CardFooter className="flex flex-wrap gap-2 border-t px-4 !pt-4">
                {quickSelectButtons.map((button) => (
                  <Button
                    key={button.label}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => handleQuickSelect(button.days)}
                    type="button"
                  >
                    {button.label}
                  </Button>
                ))}
              </CardFooter>
            </Card>
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

Calendar28.displayName = "Calendar28"

export default Calendar28

// Demo component to show usage
function Calendar28Demo() {
  const [selectedDate, setSelectedDate] = React.useState<string>("")
  
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value)
    console.log("Form value (yyyy-mm-dd):", e.target.value) // This will be yyyy-mm-dd
  }

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Calendar28 Date Picker</h2>
        <p className="text-muted-foreground">
          Display format: dd-mm-yyyy | Form value format: yyyy-mm-dd
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Date</label>
          <Calendar28
            value={selectedDate}
            onChange={handleDateChange}
            placeholder="Pick a date"
            disabledDates={[
              { dayOfWeek: [0, 6] }, // Disable weekends
              { before: new Date() } // Disable past dates
            ]}
          />
          {selectedDate && (
            <div className="text-sm space-y-1">
              <p className="text-muted-foreground">
                Form value (yyyy-mm-dd): <strong>{selectedDate}</strong>
              </p>
              <p className="text-muted-foreground">
                Display format: <strong>{selectedDate ? (() => {
                  const parts = selectedDate.split('-')
                  return `${parts[2]}-${parts[1]}-${parts[0]}`
                })() : ""}</strong>
              </p>
            </div>
          )}
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Features</h3>
        <ul className="text-sm space-y-1 text-muted-foreground">
          <li>• Users see dates in dd-mm-yyyy format</li>
          <li>• Form receives dates in yyyy-mm-dd format</li>
          <li>• Type dates directly (dd-mm-yyyy format)</li>
          <li>• Click calendar icon or press Arrow Down to open picker</li>
          <li>• Quick selection buttons for common dates</li>
          <li>• Full react-hook-form integration</li>
        </ul>
      </div>
    </div>
  )
}

// Export the demo for testing
export { Calendar28Demo }

// "use client"

// import * as React from "react"
// import { Calendar as CalendarIcon } from "lucide-react"
// import { Button } from "@/components/ui/button"
// import { Calendar } from "@/components/ui/calendar"
// import { Input } from "@/components/ui/input"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { DayPickerProps } from "react-day-picker"

// interface Calendar28Props extends React.InputHTMLAttributes<HTMLInputElement> {
//   disabledDates?: DayPickerProps["disabled"]
//   placeholder?: string
// }

// // Helper function to format date as dd-mm-yyyy
// const formatDate = (date: Date | undefined): string => {
//   if (!date) return ""
  
//   const day = date.getDate().toString().padStart(2, '0')
//   const month = (date.getMonth() + 1).toString().padStart(2, '0')
//   const year = date.getFullYear()
  
//   return `${day}-${month}-${year}`
// }

// // Helper function to check if a date is valid
// const isValidDate = (date: Date): boolean => {
//   return date instanceof Date && !isNaN(date.getTime())
// }

// // Helper function to parse dd-mm-yyyy format
// const parseDate = (dateString: string): Date | null => {
//   const parts = dateString.split('-')
//   if (parts.length !== 3) return null
  
//   const day = parseInt(parts[0], 10)
//   const month = parseInt(parts[1], 10) - 1 // Month is 0-indexed
//   const year = parseInt(parts[2], 10)
  
//   const date = new Date(year, month, day)
  
//   // Validate that the parsed date matches the input
//   if (
//     date.getDate() === day &&
//     date.getMonth() === month &&
//     date.getFullYear() === year &&
//     isValidDate(date)
//   ) {
//     return date
//   }
  
//   return null
// }

// const Calendar28 = React.forwardRef<HTMLInputElement, Calendar28Props>(
//   ({ disabledDates, placeholder = "Pick a date", value, onChange, onKeyDown, ...props }, ref) => {
//     const [open, setOpen] = React.useState(false)
//     const [date, setDate] = React.useState<Date | undefined>(
//       value ? (typeof value === 'string' ? parseDate(value) || undefined : new Date(value)) : undefined
//     )
//     const [month, setMonth] = React.useState<Date>(date || new Date())
//     const [inputValue, setInputValue] = React.useState(
//       value ? (typeof value === 'string' ? value : formatDate(new Date(value))) : ""
//     )

//     // Sync with external value changes
//     React.useEffect(() => {
//       if (value !== inputValue) {
//         if (value) {
//           const newDate = typeof value === 'string' ? parseDate(value) || undefined : new Date(value)
//           setDate(newDate)
//           setInputValue(typeof value === 'string' ? value : formatDate(newDate))
//           if (newDate) setMonth(newDate)
//         } else {
//           setDate(undefined)
//           setInputValue("")
//         }
//       }
//     }, [value, inputValue])

//     const handleDateSelect = (selectedDate: Date | undefined) => {
//       setDate(selectedDate)
//       const formattedDate = formatDate(selectedDate)
//       setInputValue(formattedDate)
      
//       if (selectedDate) {
//         setMonth(selectedDate)
//       }
      
//       // Dispatch change event for react-hook-form
//       if (onChange) {
//         const event = {
//           target: { value: formattedDate },
//           type: 'change'
//         } as React.ChangeEvent<HTMLInputElement>
//         onChange(event)
//       }
      
//       setOpen(false)
//     }

//     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//       const newValue = e.target.value
//       setInputValue(newValue)
      
//       // Try to parse the date
//       const parsedDate = parseDate(newValue)
//       if (parsedDate) {
//         setDate(parsedDate)
//         setMonth(parsedDate)
//       } else if (newValue === "") {
//         setDate(undefined)
//       }
      
//       // Always call onChange to maintain form control
//       if (onChange) {
//         onChange(e)
//       }
//     }

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//       if (e.key === "ArrowDown") {
//         e.preventDefault()
//         setOpen(true)
//       }
      
//       if (onKeyDown) {
//         onKeyDown(e)
//       }
//     }

//     const handleQuickSelect = (daysToAdd: number) => {
//       const newDate = new Date()
//       newDate.setDate(newDate.getDate() + daysToAdd)
//       handleDateSelect(newDate)
//     }

//     const quickSelectButtons = [
//       { label: "Today", days: 0 },
//       { label: "Tomorrow", days: 1 },
//       { label: "In 3 days", days: 3 },
//       { label: "In a week", days: 7 },
//       { label: "In 2 weeks", days: 14 }
//     ]

//     return (
//       <div className="relative">
//         <Input
//           {...props}
//           ref={ref}
//           value={inputValue}
//           onChange={handleInputChange}
//           onKeyDown={handleKeyDown}
//           placeholder={placeholder}
//           className="bg-background pr-10"
//         />
        
//         <Popover open={open} onOpenChange={setOpen}>
//           <PopoverTrigger asChild>
//             <Button
//               variant="ghost"
//               size="icon"
//               className="absolute top-1/2 right-2 size-6 -translate-y-1/2 hover:bg-transparent"
//               type="button"
//             >
//               <CalendarIcon className="size-4" />
//             </Button>
//           </PopoverTrigger>
          
//           <PopoverContent 
//             className="w-auto p-0" 
//             align="end" 
//             alignOffset={-8} 
//             sideOffset={10}
//           >
//             <Card className="max-w-[300px] border-none shadow-none">
//               <CardContent className="p-0">
//                 <Calendar
//                   mode="single"
//                   selected={date}
//                   onSelect={handleDateSelect}
//                   month={month}
//                   onMonthChange={setMonth}
//                   disabled={disabledDates}
//                   captionLayout="dropdown"
//                   className="bg-transparent p-0 [--cell-size:--spacing(9.5)]"
//                   initialFocus
//                 />
//               </CardContent>
              
//               <CardFooter className="flex flex-wrap gap-2 border-t px-4 !pt-4">
//                 {quickSelectButtons.map((button) => (
//                   <Button
//                     key={button.label}
//                     variant="outline"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => handleQuickSelect(button.days)}
//                     type="button"
//                   >
//                     {button.label}
//                   </Button>
//                 ))}
//               </CardFooter>
//             </Card>
//           </PopoverContent>
//         </Popover>
//       </div>
//     )
//   }
// )

// Calendar28.displayName = "Calendar28"

// export default Calendar28

// // Demo component to show usage
// function Calendar28Demo() {
//   const [selectedDate, setSelectedDate] = React.useState<string>("")
  
//   const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setSelectedDate(e.target.value)
//   }

//   return (
//     <div className="max-w-md mx-auto p-6 space-y-6">
//       <div className="space-y-2">
//         <h2 className="text-2xl font-bold">Calendar28 Date Picker</h2>
//         <p className="text-muted-foreground">
//           A comprehensive date picker component with react-hook-form integration
//         </p>
//       </div>
      
//       <div className="space-y-4">
//         <div className="space-y-2">
//           <label className="text-sm font-medium">Select Date</label>
//           <Calendar28
//             value={selectedDate}
//             onChange={handleDateChange}
//             placeholder="Pick a date"
//             disabledDates={[
//               { dayOfWeek: [0, 6] }, // Disable weekends
//               { before: new Date() } // Disable past dates
//             ]}
//           />
//           {selectedDate && (
//             <p className="text-sm text-muted-foreground">
//               Selected: {selectedDate}
//             </p>
//           )}
//         </div>
        
//         <div className="space-y-2">
//           <label className="text-sm font-medium">Another Date Picker</label>
//           <Calendar28
//             placeholder="Choose due date"
//             className="border-2"
//           />
//         </div>
//       </div>
      
//       <div className="space-y-2">
//         <h3 className="text-lg font-semibold">Features</h3>
//         <ul className="text-sm space-y-1 text-muted-foreground">
//           <li>• Type dates directly (dd-mm-yyyy format)</li>
//           <li>• Click calendar icon or press Arrow Down to open picker</li>
//           <li>• Quick selection buttons for common dates</li>
//           <li>• Month/year dropdown navigation</li>
//           <li>• Disable specific dates or date ranges</li>
//           <li>• Full react-hook-form integration</li>
//           <li>• Keyboard navigation support</li>
//         </ul>
//       </div>
//     </div>
//   )
// }

// // Export the demo for testing
// export { Calendar28Demo }

// // "use client"

// // import * as React from "react"
// // import { CalendarIcon } from "lucide-react"

// // import { Button } from "@/components/ui/button"
// // import { Calendar } from "@/components/ui/calendar"
// // import { Input } from "@/components/ui/input"
// // import { Card, CardContent, CardFooter } from "@/components/ui/card"
// // import {
// //   Popover,
// //   PopoverContent,
// //   PopoverTrigger,
// // } from "@/components/ui/popover"

// // function formatDate(date: Date | undefined) {
// //   if (!date) {
// //     return ""
// //   }

// //   // Format as dd-mm-yyyy
// //   const day = date.getDate().toString().padStart(2, '0')
// //   const month = (date.getMonth() + 1).toString().padStart(2, '0')
// //   const year = date.getFullYear()
  
// //   return `${day}-${month}-${year}`
// // }

// // function isValidDate(date: Date | undefined) {
// //   if (!date) {
// //     return false
// //   }
// //   return !isNaN(date.getTime())
// // }

// // import { DayPickerProps } from "react-day-picker";

// // interface Calendar28Props extends React.InputHTMLAttributes<HTMLInputElement> {
// //   disabledDates?: DayPickerProps["disabled"];
// //   placeholder?: string;
// // }

// // const Calendar28 = React.forwardRef<HTMLInputElement, Calendar28Props>(
// //   ({ disabledDates, placeholder = "pick a date", ...props }, ref) => {
// //     const [open, setOpen] = React.useState(false)
// //     const [date, setDate] = React.useState<Date | undefined>()
// //     const [month, setMonth] = React.useState<Date | undefined>(new Date())
// //     const [inputValue, setInputValue] = React.useState("")

// //     const handleDateSelect = (selectedDate: Date | undefined) => {
// //       setDate(selectedDate)
// //       const formattedDate = formatDate(selectedDate)
// //       setInputValue(formattedDate)
// //       setOpen(false)
      
// //       // Trigger change event for react-hook-form
// //       if (ref && typeof ref !== 'function' && ref.current) {
// //         const event = new Event('change', { bubbles: true })
// //         Object.defineProperty(event, 'target', {
// //           writable: false,
// //           value: { ...ref.current, value: selectedDate }
// //         })
// //         ref.current.dispatchEvent(event)
// //       }
// //     }

// //     const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
// //       const inputVal = e.target.value
// //       setInputValue(inputVal)
      
// //       // Try to parse the input value
// //       const parsedDate = new Date(inputVal)
// //       if (isValidDate(parsedDate)) {
// //         setDate(parsedDate)
// //         setMonth(parsedDate)
// //       }
// //     }

// //     return (
// //       <div className="flex flex-col gap-3">
// //         <div className="relative flex gap-2">
// //           <Input
// //             ref={ref}
// //             {...props}
// //             value={inputValue}
// //             placeholder={placeholder}
// //             className="bg-background pr-10"
// //             onChange={handleInputChange}
// //             onKeyDown={(e) => {
// //               if (e.key === "ArrowDown") {
// //                 e.preventDefault()
// //                 setOpen(true)
// //               }
// //             }}
// //           />
// //           <Popover open={open} onOpenChange={setOpen}>
// //             <PopoverTrigger asChild>
// //               <Button
// //                 variant="ghost"
// //                 className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
// //               >
// //                 <CalendarIcon className="size-3.5" />
// //                 <span className="sr-only">Select date</span>
// //               </Button>
// //             </PopoverTrigger>
// //             <PopoverContent
// //               className="w-auto overflow-hidden p-0"
// //               align="end"
// //               alignOffset={-8}
// //               sideOffset={10}
// //             >
// //               <Card className="max-w-[300px] border-none shadow-none">
// //                 <CardContent className="p-0">
// //                   <Calendar
// //                     mode="single"
// //                     selected={date}
// //                     captionLayout="dropdown"
// //                     month={month}
// //                     onMonthChange={setMonth}
// //                     onSelect={handleDateSelect}
// //                     disabled={disabledDates}
// //                     className="bg-transparent p-0 [--cell-size:--spacing(9.5)]"
// //                   />
// //                 </CardContent>
// //                 <CardFooter className="flex flex-wrap gap-2 border-t px-4 !pt-4">
// //                   {[
// //                     { label: "Today", value: 0 },
// //                     { label: "Tomorrow", value: 1 },
// //                     { label: "In 3 days", value: 3 },
// //                     { label: "In a week", value: 7 },
// //                     { label: "In 2 weeks", value: 14 },
// //                   ].map((preset) => (
// //                     <Button
// //                       key={preset.value}
// //                       variant="outline"
// //                       size="sm"
// //                       className="flex-1"
// //                       onClick={() => {
// //                         const newDate = new Date()
// //                         newDate.setDate(newDate.getDate() + preset.value)
// //                         handleDateSelect(newDate)
// //                       }}
// //                     >
// //                       {preset.label}
// //                     </Button>
// //                   ))}
// //                 </CardFooter>
// //               </Card>
// //             </PopoverContent>
// //           </Popover>
// //         </div>
// //       </div>
// //     )
// //   }
// // )

// // Calendar28.displayName = "Calendar28"

// // export default Calendar28