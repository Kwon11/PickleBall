"use client";
import { DayPicker } from "react-day-picker";
import DayCell from "./DayCell";

export default function Home() {
  return (
    <DayPicker
      components={{
        Day: DayCell,
      }}
    />
  );
}
