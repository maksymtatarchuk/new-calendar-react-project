

import { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import constant from '../data/constant.ts';
import calendar from '../scripts/calendar.ts';
import Modal from './Modal.tsx';
import utils from '../scripts/utils.ts';

import ColorTag from './ColorTag.tsx';
import EventTag from './EventTag.tsx';

const StyledMonthGrid = styled.div`
    min-width: 720px;
    background-color: rgba(0, 0, 0, 0.3);
    padding: 1px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
    align-items: center;
    width: ${constant.grid.width}vw;
    height: ${constant.grid.height}vh;
`;

interface DayCellProps {
    isChosenMonth: boolean;
    isToday: boolean;
}

const StyledDayCell = styled.div<DayCellProps>`
    ${props => props.isChosenMonth as boolean ? `background-color: rgba(255, 255, 255, 0.75);` : `
    background-color: rgba(255, 255, 255, 0.35);
    color: rgba(0, 0, 0, 0.5);
    `}

    ${props => props.isToday ? `
    z-index: 1;
    box-shadow: 0 0 5px orange;

    .card-header {
        font-weight: bold;
        color: orange;
    }
    ` : ''}

    .card-body {
        max-height: 80%;
        overflow-y: auto;
        scrollbar-width: none;
        -ms-overflow-style: none;
    }

    .card-body::-webkit-scrollbar {
        display: none;
    }

    min-width: ${(720 / 7) - 1}px;
    width: ${(constant.grid.width / 7) - 0.1}vw;
    height: ${(constant.grid.height / 6) - 0.1}vh;
`;

interface StyledEventProps {
    isDraggable: boolean;
}

const StyledEvent = styled.div<StyledEventProps>`
    display: flex;
    flex-direction: column;
    z-index: 2;
    position: sticky;
    background-color: rgb(126, 126, 255);
    margin-bottom: 1px;
    padding: 1px 4px;
    border-radius: 4px;
    text-wrap: nowrap;
    inline-size: 95%;
    overflow: hidden;
    user-select: none;
    font-size: small;

    .event-color-tag {
        display: flex;
      }

    ${props => props.isDraggable ? `cursor: pointer;` : `
    cursor: default;
    background-color: rgba(255, 166, 0, 0.5);
    `}

    .event-tags-bar {
        margin: 0;
        max-width: 100%;
        justify-content: start;
    }

    &:not(:hover) .event-tags-bar {
        visibility: hidden;
        height: 0px;
      }
`;


function moveEvent(date: Date, event: any, displayedEvents: any[], setDisplayedEvents: any) {
    let filteredEvents = displayedEvents.filter((checkingEvent: any) => checkingEvent.id !== event.id);
    let newEvent = event;
    newEvent.date = date;
    setDisplayedEvents([...filteredEvents, newEvent]);
}

function editeEventHandler(e: any, setNewEvent: any, displayedEvents: any[], setIsEdite: any, setModalHid: any) {
    const currentEventId = e.target.getAttribute('id') || e.target.closest('.daily-event').getAttribute('id');
    const currentEvent = displayedEvents.filter(event => event.id === currentEventId)[0];

    if (currentEvent && !currentEvent.isPublicHoliday) {
        setNewEvent(currentEvent);
        setIsEdite(true);
        setModalHid(false);
    }
}

function addNewEventHendler(e: any, newEvent: any, setNewEvent: any, setIsEdite: any, setModalHid: any) {
    if (!e.target.parentNode.className.includes('daily-event') && !e.target.className.includes('daily-event')) {
        const newEventDate = new Date(e.target.closest('.day-cell').getAttribute("data-date"));
        setNewEvent({ ...newEvent, date: newEventDate })
        setIsEdite(false);
        setModalHid(false);
    }
}

function dragHendler(e: any, events: any[], setEvent: any) {
    const currentEventId = e.target.getAttribute('id');
    setEvent(events.filter(event => event.id === currentEventId)[0]);
}

function dropHendlar(e: any, event: any, displayedEvents: any[], setDisplayedEvents: any) {
    const newDate = new Date(e.target.getAttribute("data-date"));
    moveEvent(newDate, event, displayedEvents, setDisplayedEvents);
}

function dragOverHendlar(e: any) {
    e.preventDefault()
}


const Event = (props: any) => {
    const dailyEvents = props.events.filter((event: any) => {
        return event.date.getFullYear() === props.day.date.getFullYear()
            && event.date.getMonth() === props.day.date.getMonth()
            && event.date.getDate() === props.day.date.getDate()
    });

    return (
        <>
            {dailyEvents.map((event: any) => {
                return (
                    <StyledEvent
                        className='daily-event'
                        key={'event-id-' + event.id}
                        id={event.id}
                        data-date={event.date}
                        draggable={event.isDraggable}
                        isDraggable={event.isDraggable}
                        onDragStart={e => dragHendler(e, props.events, props.setEvent)}
                        onClick={e => editeEventHandler(e, props.setNewEvent, props.displayedEvents, props.setIsEdite, props.setModalHid)}
                    >
                        <div className="event-color-tag" hidden={event.colors.length}>
                            {event.colors.map((color: string) => {
                                return <ColorTag key={props.id + '-' + color} color={color} isSelected={false} isLarge={false} />
                            })}
                        </div>

                        {event.title}

                        <div className="event-tags-bar" hidden={event.tags.length}>
                            {event.tags.map((tag: string) => {
                                return <EventTag key={tag} isLarge={false} isSelected={false}>{tag}</EventTag>
                            })}
                        </div>
                    </StyledEvent>
                )
            })}
        </>
    )

}

const MonthGrid = (props: any) => {
    const [event, setEvent] = useState({});
    const [isEdite, setIsEdite] = useState(false);
    const [modalHide, setModalHid] = useState(true);
    const [displayedEvents, setDisplayedEvents] = useState(props.allEvents);
    const monthGrid = calendar.getMonthGrid(props.date, props.locale);

    useEffect(() => {
        utils.getHolidays(props.locale, props.allEvents, props.setAllEvents);
    }, [])

    useEffect(() => {
        console.log(props.allTags)
        props.setAllTags([...new Set(displayedEvents.map((event: any) => event.tags).flat())])
    }, [props.allEvents, displayedEvents])

    useEffect(() => {
        if (props.selectedColorTags.length > 0) {
            setDisplayedEvents(
                props.allEvents.filter((event: any) => {
                    return event.colors.some((color: string) => props.selectedColorTags.includes(color as never))
                })
            )
        } else if (props.selectedTags.length > 0) {
            setDisplayedEvents(
                props.allEvents.filter((event: any) => {
                    return event.tags.some((tag: string) => props.selectedTags.includes(tag as never))
                })
            )
        } else if (props.searchText.length > 0) {
            setDisplayedEvents(
                props.allEvents.filter((event: any) => {
                    return event.title.toLowerCase().includes(props.searchText.toLowerCase())
                })
            )
        } else {
            setDisplayedEvents(props.allEvents);
        }
    }, [props.selectedColorTags, props.selectedTags, props.searchText, props.allEvents])

    return (
        <>
            <Modal
                locale={props.locale}
                displayedEvents={displayedEvents}
                setDisplayedEvents={setDisplayedEvents}
                newEvent={props.newEvent}
                setNewEvent={props.setNewEvent}
                modalHide={modalHide}
                isEdite={isEdite}
                setModalHid={setModalHid}
            />
            <StyledMonthGrid>
                {monthGrid.days.map((day) => {

                    return (
                        <StyledDayCell
                            className='day-cell'
                            key={day.dayId}
                            data-date={day.date}
                            isChosenMonth={day.isChosenMonth}
                            isToday={day.isToday}
                            onDrop={e => dropHendlar(e, event, displayedEvents, setDisplayedEvents)}
                            onDragOver={e => dragOverHendlar(e)}
                            onClick={e => addNewEventHendler(e, props.newEvent, props.setNewEvent, setIsEdite, setModalHid)}
                        >
                            <div className="card-header">
                                {day.number}
                            </div>
                            <div className='card-body'>
                                <Event
                                    date={day.date}
                                    day={day}
                                    events={displayedEvents}
                                    setEvent={setEvent}
                                    setNewEvent={props.setNewEvent}
                                    displayedEvents={displayedEvents}
                                    setIsEdite={setIsEdite}
                                    setModalHid={setModalHid}
                                />
                            </div>
                        </StyledDayCell>

                    )
                })}
            </StyledMonthGrid>
        </>
    )
}

export default MonthGrid