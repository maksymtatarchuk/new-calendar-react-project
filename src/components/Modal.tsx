import styled from '@emotion/styled';
import constant from '../data/constant';
import EventModel from '../models/EventModel';

import ColorTag from './ColorTag';
import EventTag from './EventTag';

const StyledModalBackground = styled.div`
    transition-duration: 250ms;
    user-select: none;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 9;
    background-color: rgb(37, 37, 37, 0.9);
    width: 100vw;
    height: 100vh;

    &:hover{
        background-color: rgb(37, 37, 37, 0.85);
    }
`;

const StyledModal = styled.div`
    .event-tags-bar {
        padding: 5px;
        max-width: 98%;
        max-height: 120px;
        border: 1px solid rgba(0, 0, 0, 0.25);
    }
`;

const Modal = (props: any) => {
    function deleteEvent() {
        props.setDisplayedEvents(props.displayedEvents.filter((event: any) => event.id !== props.newEvent.id))
        props.setNewEvent(new EventModel(null))
        closeModal();
    }

    function addEvent() {
        if (props.newEvent.title.trim().length) {
            props.setDisplayedEvents([...props.displayedEvents, new EventModel(props.newEvent)]);
        }

        closeModal();
    }

    function editeEvent() {
        props.setDisplayedEvents(props.displayedEvents.map((event: any) => event.id === props.newEvent.id ? props.newEvent : event))
        closeModal()
    }

    function addNewTag(event: { key: string, target: { value: string } }) {
        let tagName: string = event.key === 'Enter' ? event.target.value : event.target.value.slice(0, -1);

        if (tagName && !props.newEvent.tags.includes(tagName)) {
            props.setNewEvent({ ...props.newEvent, tags: props.newEvent.tags.concat(tagName) });
        }
        event.target.value = '';
    }

    function closeModal() {
        props.setNewEvent(new EventModel(null));
        props.setModalHid(true);
    }

    function selectTag(event: any) {
        const currentColor = event.target.getAttribute('color');

        if (currentColor && !props.newEvent.colors.includes(currentColor)) {
            props.setNewEvent({ ...props.newEvent, colors: props.newEvent.colors.concat(currentColor) });
        } else {
            props.setNewEvent({ ...props.newEvent, colors: props.newEvent.colors.filter((color: string) => color !== currentColor) });
        }
    }

    return (
        <StyledModal hidden={props.modalHide}>
            <div className='modal' >
                <div className='modal-top-bar'>
                    <div className='colors-bar'>
                        {constant.COLOR_TAGS.map((color: string) => {
                            return <ColorTag
                                key={props.id + '-' + color}
                                color={color}
                                onClick={(e: any) => selectTag(e)}
                                isSelected={props.newEvent.colors.includes(color)}
                                isLarge={true}
                            />
                        })}
                    </div>
                    <div className='modal-date'>{props.newEvent.date.toLocaleDateString(props.locale, constant.datePreset)}</div>
                </div>

                <textarea
                    placeholder='Write you text'
                    className='new-event-title'
                    value={props.newEvent.title}
                    onChange={(event) => props.setNewEvent({ ...props.newEvent, title: event.target.value })}
                />
                <input
                    className='tags-input'
                    placeholder='tags'
                    onKeyDown={(event) => { if (event.key === 'Enter') addNewTag(event as any) }}
                    onBlur={event => {
                        event.target.value += ' ';
                        addNewTag(event as any);
                    }}
                    onChange={(event: any): void => {
                        if (event.nativeEvent.data === ','
                            || event.nativeEvent.data === ' '
                            || event.nativeEvent.data === '.') {
                            addNewTag(event);
                        }
                    }} />
                <div className='event-tags-bar'>
                    {props.newEvent.tags.map((tag: string) => {
                        return <EventTag
                            key={tag}
                            id={tag}
                            isLarge={true}
                            isSelected={false}
                            onClick={(event: any) => {
                                props.setNewEvent({ ...props.newEvent, tags: props.newEvent.tags.filter((tag: string) => tag !== event.target.id) });
                            }}>{tag}</EventTag>
                    })}
                </div>

                <div className='modal-bottom-bar'>
                    <button className='modal-button' onClick={addEvent} hidden={props.isEdite}>Add</button>
                    <button className='modal-button' onClick={editeEvent} hidden={!props.isEdite}>Edit</button>
                    <button className='modal-button cancel-btn' onClick={closeModal}>Cancel</button>
                    <button className='modal-button remove-btn' onClick={deleteEvent} hidden={!props.isEdite}>Delete</button>
                </div>
            </div>
            <StyledModalBackground onClick={closeModal} className='modal-background' />
        </StyledModal>
    )
}

export default Modal