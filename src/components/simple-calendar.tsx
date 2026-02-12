'use client';

import React, { useState } from 'react';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCalendarProps {
  onSelect: (date: Date) => void;
  selectedDate: Date | undefined;
}

export function SimpleCalendar({ onSelect, selectedDate }: SimpleCalendarProps) {
  const [displayDate, setDisplayDate] = useState(selectedDate || new Date());

  const year = displayDate.getFullYear();
  const month = displayDate.getMonth();

  const getCalendarTable = () => {
    // Start with the current display month
    const d = new Date(year, month);

    // Table header
    let table = '<table><thead><tr><th>пн</th><th>вт</th><th>ср</th><th>чт</th><th>пт</th><th>сб</th><th>вс</th></tr></thead><tbody><tr>';

    // Add empty cells for the first days of the week until the first day of the month
    for (let i = 0; i < getDay(d); i++) {
      table += '<td></td>';
    }

    // Add the days of the month
    while (d.getMonth() === month) {
      const currentDate = new Date(d);
      const isSelected = selectedDate &&
        currentDate.getDate() === selectedDate.getDate() &&
        currentDate.getMonth() === selectedDate.getMonth() &&
        currentDate.getFullYear() === selectedDate.getFullYear();
      
      const isToday = new Date().toDateString() === currentDate.toDateString();

      let className = '';
      if (isSelected) {
        className = 'selected';
      } else if (isToday) {
        className = 'today';
      }

      table += `<td class="${className}" data-date="${currentDate.toISOString()}">${currentDate.getDate()}</td>`;

      if (getDay(currentDate) % 7 === 6) { // Sunday, end of the week
        table += '</tr><tr>';
      }

      d.setDate(d.getDate() + 1);
    }

    // Add empty cells for the remaining days of the week
    if (getDay(d) !== 0) {
      for (let i = getDay(d); i < 7; i++) {
        table += '<td></td>';
      }
    }

    // Close the last row and table
    table += '</tr></tbody></table>';
    return table;
  };

  // Helper function to get the day of the week (0=Monday, 6=Sunday)
  function getDay(date: Date) {
    let day = date.getDay();
    if (day === 0) day = 7; // make Sunday (0) the last day
    return day - 1;
  }

  const handlePrevMonth = () => {
    setDisplayDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setDisplayDate(new Date(year, month + 1, 1));
  };

  const handleCellClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'TD' && target.dataset.date) {
      onSelect(new Date(target.dataset.date));
    }
  };

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  return (
    <div className="simple-calendar-container rounded-lg border bg-card p-4">
      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={handlePrevMonth}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-medium text-center">{monthNames[month]} {year}</div>
        <Button variant="outline" size="icon" onClick={handleNextMonth}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div
        onClick={handleCellClick}
        dangerouslySetInnerHTML={{ __html: getCalendarTable() }}
      />
    </div>
  );
}
