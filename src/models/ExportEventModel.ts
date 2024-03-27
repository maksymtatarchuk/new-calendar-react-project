import utils from '../scripts/utils';

interface ExportEventModel {
    id: string;
    title: string;
    date: Date;
    tags: string[];
    colors: string[];
    isDraggable: boolean;
}

function setDate(date: Date) {
    return new Date(date.getFullYear(), date.getMonth() - 1, date.getDate())
}

class ExportEventModel {
    constructor(data: any) {
        this.id = utils.generateEventID();
        this.title = data.title;
        this.date = setDate(data.date);
        this.tags = data.tags;
        this.colors = data.colors;
        this.isDraggable = true;
    }
}

export default ExportEventModel