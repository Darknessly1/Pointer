import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = ({ events, onEventClick, onEventDrop }) => {
    const handleEventClick = (clickInfo) => {
        const { id, title, start, end } = clickInfo.event;
        onEventClick({
            id,
            title,
            start: start ? start.toISOString().slice(0, 10) : null,
            end: end ? end.toISOString().slice(0, 10) : null,
        });
    };

    const handleEventDrop = async (info) => {
        const updatedEvent = {
            title: info.event.title,
            dateStart: info.event.start.toISOString(),
            dateEnd: info.event.end?.toISOString() || null,
            priority: info.event.extendedProps.priority, // Ensure all necessary fields are passed
        };

        try {
            // Update backend
            const response = await fetch(`http://localhost:5000/api/schedule/updateSchedule/${info.event.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEvent),
            });

            if (!response.ok) {
                throw new Error("Failed to update schedule");
            }

            const updatedTask = await response.json();

            // Update local state
            onEventDrop((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === updatedTask._id ? updatedTask : event
                )
            );
        } catch (error) {
            console.error("Error updating event:", error);
            info.revert(); // Revert changes on error
        }
    };


    // const handleEventDrop = (eventDropInfo) => {
    //     console.log("Event Drop Info:", eventDropInfo); 
    //     const { id, title, start, end } = eventDropInfo.event;
    //     onEventDrop({
    //         id,
    //         title,
    //         newDateStart: start ? start.toISOString() : null,
    //         newDateEnd: end ? end.toISOString() : null,       
    //     });
    // };

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4 z-0">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable={true} // Make sure this is true
                eventClick={handleEventClick}
                eventDrop={handleEventDrop} // Ensure this is correctly set
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                height="auto"
                contentHeight="auto"
                timeZone="local" // Ensure dates respect local timezone
            />
        </div>
    );
};

export default Calendar;