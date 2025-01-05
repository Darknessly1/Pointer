// Schedulestable.jsx
import { useState }  from './Calendar';

const Schedulestable = () => {
    const [schedule, setSchedule] = useState([]);
    const [event, setEvent] = useState('');
    const [date, setDate] = useState('');

    const handleAddEvent = () => {
        if (event && date) {
            setSchedule([...schedule, { event, date }]);
            setEvent('');
            setDate('');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 p-5">
            <h1 className="text-2xl font-bold text-center mb-5">Schedule System</h1>
            <div className="flex flex-col items-center mb-5">
                <input
                    type="text"
                    placeholder="Event"
                    value={event}
                    onChange={(e) => setEvent(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full max-w-sm"
                />
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2 mb-2 w-full max-w-sm"
                />
                <button
                    onClick={handleAddEvent}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add Event
                </button>
            </div>
            <Calendar schedule={schedule} />
        </div>
    );
};

export default Schedulestable;