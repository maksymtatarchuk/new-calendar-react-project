import constant from '../data/constant';

/**
 * Returns array with days of month data.
 *
 * @param {number} year chosen year
 * @param {number} month chosen month
 * @param {boolean} isChosenMonth is current month
 * @return {array} array with days of month.
 */
function getMonthDaysData(year: number, month: number, locale: string, isChosenMonth: boolean): Array<any> {
    const firstDayOfMonth = new Date(year, month + 1, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const allDaysOfMonth: any[] = [];
    let weekNumber = 1;

    if (firstDayOfMonth.toLocaleString(locale, { weekday: 'short' }) === constant.WEEK_DAYS[1]) { weekNumber -= 1; }

    for (let i = 0; i < lastDayOfMonth.getDate(); i++) {
        const day = i + 1;
        const weekDay = new Date(year, month, day).toLocaleString(locale, { weekday: 'short' });

        if (weekDay === constant.WEEK_DAYS[0]) { weekNumber += 1; }

        const data = {
            isChosenMonth: isChosenMonth || false,
            isToday: new Date().getMonth() === month && new Date().getDate() === day,
            dayId: month + '-' + day,
            date: new Date(year, month, day),
            number: day,
            weekDay: weekDay,
            weekNumber: weekNumber
        }

        allDaysOfMonth.push(data);
    }

    return allDaysOfMonth
}

// Public functions

function getMonthGrid(date: Date, locale: string) {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDayOfMonth = new Date(year, month, 1);

    let monthGrid: any[] = [];

    if (firstDayOfMonth.toLocaleString(locale, { weekday: 'short' }) !== constant.WEEK_DAYS[1]) {
        const prevMonthDays = getMonthDaysData(year, month - 1, locale, false);
        const weeksInMonth = prevMonthDays[prevMonthDays.length - 1].weekNumber;

        prevMonthDays.map(day => {
            if (day.weekNumber === weeksInMonth) {
                monthGrid.push(day)
            }
        });
    }

    monthGrid = monthGrid.concat(getMonthDaysData(year, month, locale, true));

    let missingDays = constant.CELLS_ON_MONTH_SHEET - monthGrid.length;

    if (missingDays) {
        const nextMonthDays = getMonthDaysData(year, month + 1, locale, false);
        for (let i = 0; i < missingDays; i++) {
            monthGrid.push(nextMonthDays[i]);
        }
    }

    return {
        year: year,
        month: {
            number: month,
            shortName: new Date(year, month).toLocaleString(locale, { month: 'short' }),
            longName: new Date(year, month).toLocaleString(locale, { month: 'long' })
        },
        days: monthGrid
    }
}

export default {
    getMonthGrid
}