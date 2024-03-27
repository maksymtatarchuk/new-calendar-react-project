import utils from '../scripts/utils';

function setDate(rawDate: any) {
    rawDate = new Date(rawDate)
    return new Date(new Date(rawDate.getFullYear(), rawDate.getMonth() - 1, rawDate.getDate()).setHours(0, 0, 0));
}
interface HolidayEventModel {
    id: string;
    title: string;
    date: Date;
    tags: string[];
    colors: string[];
    isDraggable: boolean;
    isPublicHoliday: boolean;
}

class HolidayEventModel {
    constructor(data: any) {
        this.id = utils.generateEventID();
        this.title = data.localName;
        this.date = setDate(data.date);
        this.tags = [];
        this.colors = [];
        this.isDraggable = false;
        this.isPublicHoliday = true;
    }
}

export default HolidayEventModel