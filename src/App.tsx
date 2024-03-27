import './App.css'
import { useState } from 'react';
import html2canvas from 'html2canvas';
import constant from './data/constant';
import utils from './scripts/utils.ts';
import calendar from './scripts/calendar.ts';

import EventModel from './models/EventModel';
import ExportEventModel from './models/ExportEventModel.ts';
import MonthGrid from './components/MonthGrid.tsx';
import ColorTag from './components/ColorTag.tsx';
import EventTag from './components/EventTag.tsx';

const locale = navigator.language || constant.locale;

function App() {
  const [date, setDate] = useState(new Date())
  const [allEvents, setAllEvents] = useState(utils.exportEvents());
  const [newEvent, setNewEvent] = useState(new EventModel(null));
  const [selectedTags, setSelectedTags] = useState([] as any);
  const [searchText, setSearchText] = useState('' as string);
  const [selectedColorTags, setSelectedColorTags] = useState([]);
  const [allTags, setAllTags] = useState([]);
  const monthGrid = calendar.getMonthGrid(date, locale);

  function handleUploadJsonEvents() {
    const input = document.getElementById('import-events') as HTMLInputElement;
    input.click();
  }

  async function uploadJsonEvents(event: any) {
    const fileReader = new FileReader();
    fileReader.readAsText(event.target.files[0], 'UTF-8');
    fileReader.onload = (action: any) => {
      setAllEvents(allEvents.concat(JSON.parse(action.target.result).map((importedEvent: any) => new EventModel(importedEvent))));
    }
  }

  async function downloadCalendarAsImage() {
    const element = document.getElementsByClassName('calendar-grid')[0];
    const canvas = await html2canvas(element as HTMLElement);
    const data = canvas.toDataURL('image/jpg');
    const link = document.createElement('a');

    link.href = data;
    link.download = 'Calendar - ' + monthGrid.month.longName + '-' + monthGrid.year + '.jpg';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function downloadJsonEvents() {
    const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
      JSON.stringify(allEvents.map((event: any) => new ExportEventModel(event)))
    )}`;

    const link = document.createElement('a');
    link.href = jsonString;
    link.download = `EXPORT_${new Date().toLocaleDateString()}.json`;
    link.click();
  }

  function handleColorTagsFilter(color: string) {
    if (selectedColorTags.includes(color as never)) {
      setSelectedColorTags(selectedColorTags.filter(selectedColor => selectedColor !== color));
    } else {
      setSelectedColorTags([...selectedColorTags as never, color as never]);
    }
  }

  function HandleEventTagsFilter(event: any) {
    if (!selectedTags.includes(event.target.id)) {
      setSelectedTags([...selectedTags, event.target.id]);
    } else {
      setSelectedTags(selectedTags.filter((selectedTag: string) => selectedTag !== event.target.id));
    }
  }

  return (
    <div className="style-calendar-container">
      <div className='calendar-top-bar'>
        <button className='calendar-btn' onClick={() => setDate(new Date(date.setMonth(date.getMonth() - 1)))}> Previous </button>
        <div className='top-bar-part'>
          <button onClick={handleUploadJsonEvents}> Upload </button>
          <button onClick={downloadJsonEvents}> Download </button>
          <button onClick={downloadCalendarAsImage}> Pic </button>
        </div>

        <div className='colors-bar'>
          {constant.COLOR_TAGS.map((color: string) => {
            return <ColorTag
              key={'color-tag-id-' + color}
              color={color}
              isSelected={selectedColorTags.includes(color as never)}
              isLarge={true}
              onClick={() => handleColorTagsFilter(color)}
            />
          })}
        </div>

        <h2>{monthGrid.month.longName + ' ' + monthGrid.year}</h2>

        <div className='event-tags-bar'>
          {allTags.map((tag) => {
            return <EventTag
              key={tag + '-tag-filter'}
              id={tag}
              onClick={e => HandleEventTagsFilter(e)}
              isSelected={selectedTags.includes(tag)}
              isLarge={false}>{tag}</EventTag>
          })}
        </div>

        <input
          placeholder='Search'
          className='top-menu-labels-filter'
          onChange={(event: any) => { setSearchText(event.target.value) }}></input>
        <button className='calendar-btn' onClick={() => setDate(new Date(date.setMonth(date.getMonth() + 1)))}> Next </button>
      </div>

      <div className='calendar-grid'>
        <div className="week-days">
          {constant.WEEK_DAYS.map((dayOfWeek) => {
            return (
              <div className='day-of-week' key={dayOfWeek}>
                {dayOfWeek}
              </div>
            )
          })}
        </div>

        <MonthGrid
          date={date}
          locale={locale}
          allEvents={allEvents}
          setAllEvents={setAllEvents}
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          selectedColorTags={selectedColorTags}
          selectedTags={selectedTags}
          setSelectedTags={setSelectedTags}
          searchText={searchText}
          setSearchText={setSearchText}
          allTags={allTags}
          setAllTags={setAllTags}
        />
      </div>
      <input id='import-events' type='file' onChange={(event: any) => uploadJsonEvents(event)} hidden />
    </div >
  )
}

export default App
