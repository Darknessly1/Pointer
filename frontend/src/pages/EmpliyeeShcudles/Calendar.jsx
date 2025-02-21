import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import listPlugin from '@fullcalendar/list';

const Calendar = ({
    events,
    onEventClick,
    onEventDrop,
    // userId,
    setInputs,
    setOpenAddTaskSection,
}) => {
    const handleEventClick = (clickInfo) => {
        const { id, title, start, end, extendedProps } = clickInfo.event;
        onEventClick({
            id,
            title,
            start: start ? start.toISOString() : null,
            end: end ? end.toISOString() : null,
            timeStart: start ? start.toISOString().split('T')[1].substring(0, 5) : '',
            timeEnd: end ? end.toISOString().split('T')[1].substring(0, 5) : '',
            priority: extendedProps.priority,
        });
    };

    // const handleEventDrop = async (info) => {
    //     const updatedEvent = {
    //         title: info.event.title,
    //         dateStart: info.event.start.toISOString(),
    //         dateEnd: info.event.end?.toISOString() || null,
    //         priority: info.event.extendedProps.priority,
    //         userId: userId,
    //     };

    //     try {
    //         const response = await fetch(`http://localhost:9000/api/schedule/updateSchedule/${info.event.id}`, {
    //             method: 'PUT',
    //             headers: { 'Content-Type': 'application/json' },
    //             body: JSON.stringify(updatedEvent),
    //         });

    //         if (!response.ok) {
    //             throw new Error("Failed to update schedule");
    //         }

    //         const updatedTask = await response.json();

    //         onEventDrop((prevEvents) =>
    //             prevEvents.map((event) =>
    //                 event.id === updatedTask._id ? { ...event, ...updatedTask } : event
    //             )
    //         );
    //     } catch (error) {
    //         console.error("Error updating event:", error);
    //         info.revert();
    //     }
    // };


    const handleDateSelect = (selectInfo) => {
        const localStartDate = new Date(selectInfo.start).toLocaleDateString('en-CA');
        setInputs({
            title: '',
            dateStart: localStartDate,
            dateEnd: '',
            priority: ''
        });
        setOpenAddTaskSection(true);
    };

    return (
        <div className="bg-white shadow-lg overflow-hidden p-4 z-0 border-2 border-black rounded-3xl">
            <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                initialView="dayGridMonth"
                events={events}
                editable={true}
                selectable={true}
                selectMirror={true}
                dayMaxEvents="true"
                eventResizableFromStart={true}
                select={handleDateSelect}
                eventClick={handleEventClick}
                eventDrop={onEventDrop}
                timeZone="UTC"
                height="auto"
                contentHeight="auto"
                dayMaxEventRows={true}
                slotDuration="01:00:00"
                nowIndicator={true}
                weekNumbers={true}
                allDaySlot={false}
                displayEventTime={true}
                dayHeaderFormat={{ weekday: 'long' }}
                slotLabelFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
                eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: 'short' }}
                businessHours={{
                    startTime: '00:00',
                    endTime: '24:00',
                }}
                views={{
                    listDay: { buttonText: 'List Day', listDayFormat: { weekday: "long", month: "short", day: "numeric" } },
                    listWeek: { buttonText: 'List Week' },
                    listMonth: { buttonText: 'List Month' },
                    timeGridWeek: { buttonText: 'Week' },
                    timeGridDay: { buttonText: 'Day' }
                }}
                headerToolbar={{
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay listDay,listWeek,listMonth',
                }}
            />
        </div>
    );
};

export default Calendar;
