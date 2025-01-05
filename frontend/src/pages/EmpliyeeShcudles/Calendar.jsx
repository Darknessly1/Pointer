import { useState } from 'react';

const Calendar = ({ schedule }) => {
    const [selectedDate, setSelectedDate] = useState(new Date());
    
    const getCurrentWeek = (date) => {
        const startOfWeek = new Date(date);
        const day = startOfWeek.getDay();
        const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
        return Array.from({ length: 7 }, (_, i) => new Date(startOfWeek.setDate(diff + i)));
    };

    const handleDateChange = (e) => {
        const newDate = new Date(selectedDate);
        newDate.setFullYear(e.target.value);
        setSelectedDate(newDate);
    };

    const handleMonthChange = (e) => {
        const newDate = new Date(selectedDate);
        newDate.setMonth(e.target.value);
        setSelectedDate(newDate);
    };

    const weeks = getCurrentWeek(selectedDate);
    const eventsByDate = schedule.reduce((acc, { event, date }) => {
        const eventDate = new Date(date).toDateString();
        if (!acc[eventDate]) acc[eventDate] = [];
        acc[eventDate].push(event);
        return acc;
    }, {});

    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    return (
        <div className="p-4 bg-white rounded-lg shadow">
            <div className="bg-gray-200">
                <div className="container mx-auto mt-10">
                    <div className="wrapper bg-white rounded shadow w-full">
                        <div className="header flex justify-between border-b p-2">
                            <div className="flex items-center">
                                <select value={selectedDate.getMonth()} onChange={handleMonthChange} className="border border-gray-300 rounded px-2 py-1 mr-2">
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <option key={i} value={i}>{new Date(0, i).toLocaleString('default', { month: 'long' })}</option>
                                    ))}
                                </select>
                                <select value={selectedDate.getFullYear()} onChange={handleDateChange} className="border border-gray-300 rounded px-2 py-1">
                                    {Array.from({ length: 10 }, (_, i) => (
                                        <option key={i} value={2023 + i}>{2023 + i}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr>
                                    <th className="p-2 border-r h-10">Day/Time</th>
                                    {weeks.map((date, index) => (
                                        <th key={index} className="p-2 border-r h-10">{date.toLocaleDateString()}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {hours.map((hour, hourIndex) => (
                                    <tr key={hourIndex} className="text-center h-20">
                                        <td className="border p-1 h-40">{hour}</td>
                                        {weeks.map((date, index) => {
                                            const eventDate = date.toDateString();
                                            return (
                                                <td key={index} className="border p-1 h-40 overflow-auto transition cursor-pointer duration-500 ease hover:bg-gray-300">
                                                    <div className="flex flex-col h-40 mx-auto overflow-hidden">
                                                        <div className="bottom flex-grow h-30 py-1 w-full">
                                                            {eventsByDate[eventDate]?.map((event, idx) => (
                                                                <div key={idx} className="event bg-purple-400 text-white rounded p-1 text-sm mb-1">
                                                                    <span className="event-name">{event}</span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Calendar;