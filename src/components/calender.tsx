import { useState } from 'react';

const Calendar: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());

    const handleDateChange = (date: Date) => {
        setSelectedDate(date);
    };

    return (
        <div className="calendar">
            <h2>Calendar</h2>
            <input
                type="date"
                value={selectedDate.toISOString().slice(0, 10)}
                onChange={(e) => handleDateChange(new Date(e.target.value))}
            />
        </div>
    );
};

export default Calendar;
