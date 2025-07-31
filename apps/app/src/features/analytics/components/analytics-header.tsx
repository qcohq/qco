"use client";

import { Button } from "@qco/ui/components/button";
import { Calendar } from "@qco/ui/components/calendar";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@qco/ui/components/popover";
import { CalendarIcon, Download, Filter } from "lucide-react";
import { useState } from "react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@qco/ui/lib/utils";

export function AnalyticsHeader() {
    const [date, setDate] = useState<Date>();

    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Analytics</h1>
                <p className="text-muted-foreground">
                    Аналитика продаж и производительности магазина
                </p>
            </div>

            <div className="flex items-center gap-2">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button
                            variant="outline"
                            className={cn(
                                "w-[240px] justify-start text-left font-normal",
                                !date && "text-muted-foreground"
                            )}
                        >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {date ? format(date, "PPP", { locale: ru }) : "Выберите дату"}
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="end">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>

                <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                </Button>

                <Button variant="outline" size="icon">
                    <Download className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
} 