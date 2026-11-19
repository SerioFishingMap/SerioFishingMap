"use client";

import {
  Button,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverBody,
  Box,
} from "@chakra-ui/react";
import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarButton() {
  const [date, setDate] = useState<Date | null>(new Date());

  return (
    <Popover>
      <PopoverTrigger>
        <Button colorScheme="teal">カレンダーを開く</Button>
      </PopoverTrigger>
      <PopoverContent>
        <PopoverArrow />
        <PopoverCloseButton />
        <PopoverBody>
          <Box>
            <Calendar
              onChange={(value) => {
                if (value instanceof Date || value === null) {
                  setDate(value);
                }
              }}
              value={date}
              locale="ja-JP"
              selectRange={false}
            />
          </Box>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
}
