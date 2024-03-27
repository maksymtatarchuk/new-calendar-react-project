import utils from '../scripts/utils';

interface EventModel {
    id: string;
    title: string;
    date: Date;
    tags: string[];
    colors: string[];
    isDraggable: boolean;
    isPublicHoliday: boolean;
}

function setDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

class EventModel {
    constructor(data: any) {
        this.id = utils.generateEventID();
        this.title = data && data.title || '';
        this.date = data && data.date ? setDate(new Date(data.date)) : new Date();
        this.tags = data && data.tags || [];
        this.colors = data && data.colors || [];
        this.isDraggable = true;
        this.isPublicHoliday = false;
    }
}

export default EventModel