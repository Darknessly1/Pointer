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
        <div className="flex gap-4 items-start">
            <div className="bg-white/60 shadow-lg overflow-hidden p-4 z-0 border-2 border-black rounded-3xl w-[70%]">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                    initialView="dayGridMonth"
                    events={events}
                    editable={true}
                    selectable={true}
                    selectMirror={true}
                    dayMaxEvents={true}
                    eventResizableFromStart={true}
                    select={handleDateSelect}
                    eventClick={handleEventClick}
                    eventDrop={onEventDrop}
                    timeZone="UTC"
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
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    customButtons={{
                        title: {
                            text: 'title',
                            click: () => { },
                            classNames: ['fc-center-title']
                        }
                    }}
                />
            </div>
                    
            <div className="bg-white/60 shadow-lg overflow-hidden p-4 z-0 border-2 border-black rounded-3xl w-[30%]">
                <h1
                    className='text-center font-bold text-2xl text-gray-800 mb-4'
                >
                    List of Small tasks
                </h1>
                <FullCalendar
                    plugins={[listPlugin]}
                    initialView="listDay"
                    events={events}
                    editable={true}
                    eventClick={handleEventClick}
                    eventDrop={onEventDrop}
                    timeZone="UTC"
                    contentHeight="auto"
                    slotDuration="01:00:00"
                    nowIndicator={true}
                    displayEventTime={true}
                    slotLabelFormat={{ hour: 'numeric', minute: '2-digit', meridiem: 'short' }}
                    eventTimeFormat={{ hour: '2-digit', minute: '2-digit', meridiem: 'short' }}
                    businessHours={{
                        startTime: '00:00',
                        endTime: '24:00',
                    }}
                    views={{
                        listDay: { buttonText: 'Day', listDayFormat: { weekday: "long", month: "short", day: "numeric" } },
                        listWeek: { buttonText: 'Week' },
                        listMonth: { buttonText: 'Month' },
                    }}
                    headerToolbar={{
                        left: 'title prev next today',
                        center: '',
                        right: 'listDay,listWeek,listMonth',
                    }}
                />
            </div>
        </div>


    );
};

export default Calendar;
