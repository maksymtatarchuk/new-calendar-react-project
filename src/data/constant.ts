const CELLS_ON_MONTH_SHEET = 42;
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const COLOR_TAGS = ['red', 'green', 'blue'];
const datePreset = { weekday: 'long', day: "numeric", month: "short", year: "numeric" };
const locale = 'en-US';


const grid: any = {
    width: 96,
    height: 86
}

export default {
    CELLS_ON_MONTH_SHEET,
    WEEK_DAYS,
    COLOR_TAGS,
    datePreset,
    locale,
    grid
}