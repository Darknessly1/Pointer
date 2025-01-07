import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = ({ events, onEventClick, onEventDrop }) => {
    const handleEventClick = (clickInfo) => {
        const { id, title, start, end} = clickInfo.event;
        onEventClick({ id, title, start: start.toLocaleDateString('en-CA'), end: end.toLocaleDateString('en-CA') });
    };

    const handleEventDrop = (eventDropInfo) => {
        const { id, title, start, end } = eventDropInfo.event;
        onEventDrop({ id, title, newDateStart: start.toLocaleDateString('en-CA'),  newDateEnd: end.toLocaleDateString('en-CA') });
    };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4 z-0">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable={true} // Enable drag-and-drop
                eventClick={handleEventClick}
                eventDrop={handleEventDrop} // Handle drop events
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                height="auto"
                contentHeight="auto"
            />
        </div>
    );
};

export default Calendar;
