import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

const Calendar = ({ 
    events, 
    onEventClick, 
    onEventDrop, 
    userId, 
    setInputs, 
    setOpenAddTaskSection, 
}) => {
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
            priority: info.event.extendedProps.priority,
            userId: userId,
        };

        try {
            const response = await fetch(`http://localhost:5000/api/schedule/updateSchedule/${info.event.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedEvent),
            });

            if (!response.ok) {
                throw new Error("Failed to update schedule");
            }

            const updatedTask = await response.json();

            onEventDrop((prevEvents) =>
                prevEvents.map((event) =>
                    event.id === updatedTask._id ? { ...event, ...updatedTask } : event
                )
            );
        } catch (error) {
            console.error("Error updating event:", error);
            info.revert();
        }
    };

    const handleDateSelect = (selectInfo) => {
        // Convert the selected date to a local date string
        const localStartDate = new Date(selectInfo.start).toLocaleDateString('en-CA'); // 'en-CA' gives YYYY-MM-DD format
        setInputs({
            title: '', 
            dateStart: localStartDate,
            dateEnd: '',
            priority: '' 
        });
        setOpenAddTaskSection(true); 
    };


    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden p-4 z-0">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable={true}
                selectable={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={handleEventDrop}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                }}
                height="auto"
                contentHeight="auto"
                timeZone="local"
                // eventRender={(info) => {
                //     info.el.style.backgroundColor = info.event.extendedProps.backgroundColor; 
                // }}
            />
        </div>
    );
};

export default Calendar;
