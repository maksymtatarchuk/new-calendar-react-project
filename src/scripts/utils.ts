import { v4 as uuidv4 } from 'uuid';
import eventsData from '../data/events.ts';
import ExportEventModel from '../models/ExportEventModel.ts';
import HolidayEventModel from '../models/HolidayEventModel';

function generateEventID() {
    return 'UUID-' + uuidv4();
}

function exportEvents() {
    return eventsData.map(event => new ExportEventModel(event))

}

/**
 * Get this year holidays
 *
 * @param {string} locale chosen locale
 * @param {any[]} allEvents all events
 * @param {any} setAllEvents set displayed events
 * @return {Promise<void>}
 */
async function getHolidays(locale: string, allEvents: any[], setAllEvents: any): Promise<void> {
    try {
        fetch(`https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/${locale.split('-')[1]}`)
            .then((res) => {
                return res.json()
            })
            .then((data: any[]) => {
                // Filter duplicates in holidays data
                let filterTitle: any[] = [];

                const filteredEvents = data.filter((event) => {
                    if (!filterTitle.includes(event.localName)) {
                        filterTitle.push(event.localName);

                        return event;
                    }
                })

                return filteredEvents;
            })
            .then((data: any[]) => {
                setAllEvents(allEvents.concat(data.map((publicHolidayEvent: object) => {
                    return new HolidayEventModel(publicHolidayEvent)
                })));
            })
    } catch (error) {
        console.error('Het holidays error: ', error)
    }
}

export default {
    generateEventID,
    exportEvents,
    getHolidays
}