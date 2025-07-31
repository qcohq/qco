"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { cn } from "../lib/utils";

interface ColorPickerProps {
    value?: string;
    onChange?: (color: string) => void;
    colors?: string[];
    className?: string;
}

const defaultColors = [
    "#000000", "#ffffff", "#ff0000", "#00ff00", "#0000ff",
    "#ffff00", "#ff00ff", "#00ffff", "#ffa500", "#800080",
    "#008000", "#ffc0cb", "#a52a2a", "#808080", "#c0c0c0"
];

export const ColorPicker = React.forwardRef<HTMLButtonElement, ColorPickerProps>(
    ({ value, onChange, colors = defaultColors, className, ...props }, ref) => {
        return (
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        variant="outline"
                        className={cn(
                            "h-10 w-10 p-0 border-2",
                            className
                        )}
                        style={{ backgroundColor: value }}
                        {...props}
                    >
                        <span className="sr-only">Выбрать цвет</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-64 p-3">
                    <div className="grid grid-cols-5 gap-2">
                        {colors.map((color) => (
                            <Button
                                key={color}
                                variant="outline"
                                size="sm"
                                className={cn(
                                    "h-8 w-8 p-0 border-2",
                                    value === color && "ring-2 ring-ring ring-offset-2"
                                )}
                                style={{ backgroundColor: color }}
                                onClick={() => onChange?.(color)}
                            >
                                {value === color && (
                                    <Check className="h-3 w-3 text-white" />
                                )}
                                <span className="sr-only">{color}</span>
                            </Button>
                        ))}
                    </div>
                </PopoverContent>
            </Popover>
        );
    }
);

ColorPicker.displayName = "ColorPicker"; 