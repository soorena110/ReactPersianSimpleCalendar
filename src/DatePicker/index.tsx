import * as React from 'react';
import {MouseEvent} from 'react';
import Persian from "persian-info";
import './style.css'

export interface DatePickerProps {
    onDaySelected?: (event: DatePickerSelectionEvent) => void;
    selectedDay?: string;
    onFocus?: () => void;
    onBlur?: () => void;
}

interface DatePickerState {
    showingDate: DatePickerMonthYear;
    today: DatePickerDate;
    selectedDay?: DatePickerDate
}

interface DatePickerMonthYear {
    year: number;
    month: number;
}

interface DatePickerDate {
    year: number;
    month: number;
    day: number;
}

export interface DatePickerSelectionEvent {
    previousDay: string;
    selectedDay: string;
}

export default class DatePicker extends React.Component<DatePickerProps, DatePickerState> {
    //#region Component

    constructor(props: DatePickerProps) {
        super(props);

        let selectedDay: DatePickerDate | undefined;
        if (props.selectedDay) {
            const sp = props.selectedDay.split('/');
            selectedDay = {year: parseInt(sp[0]), month: parseInt(sp[1]), day: parseInt(sp[2])};
        }

        const now = DatePicker.getNow();
        this.state = {
            showingDate: {year: now.year, month: now.month},
            today: {year: now.year, month: now.month, day: now.day},
            selectedDay: selectedDay
        };

        this.goToNextMonth = this.goToNextMonth.bind(this);
        this.goToPrevMonth = this.goToPrevMonth.bind(this);
        this.goToCurrentMonth = this.goToCurrentMonth.bind(this);
        this.onDayClick = this.onDayClick.bind(this);
    }

    getSnapshotBeforeUpdate(prevProps: DatePickerProps) {
        if (this.props.selectedDay && this.props.selectedDay != prevProps.selectedDay) {
            const sp = this.props.selectedDay.split('/');
            const selectedDay = {year: parseInt(sp[0]), month: parseInt(sp[1]), day: parseInt(sp[2])};
            this.setState({selectedDay})
        }
        return {}
    }

    componentDidUpdate() {
    }

    //#endregion

    //#region Helpers

    private static getNow() {
        const jalaliNow = Persian.date.getJalaliNow();
        return {year: jalaliNow.year, month: jalaliNow.month, day: jalaliNow.day};
    }

    //#endregion

    //#region Events

    private goToNextMonth() {
        let m = this.state.showingDate.month;
        let y = this.state.showingDate.year;

        m++;
        if (m > 12) {
            m = 1;
            y++;
        }

        this.setState({showingDate: {year: y, month: m} as DatePickerMonthYear});
    }

    private goToPrevMonth() {
        let m = this.state.showingDate.month;
        let y = this.state.showingDate.year;

        m--;
        if (m <= 0) {
            m = 12;
            y--;
        }
        this.setState({showingDate: {year: y, month: m} as DatePickerMonthYear});
    }

    private goToCurrentMonth() {
        const now = DatePicker.getNow();
        this.setState({showingDate: {year: now.year, month: now.month} as DatePickerMonthYear});
    }

    private onDayClick(e: MouseEvent<HTMLElement>) {
        if (e.currentTarget.classList.contains('off'))
            return;

        const targetText = e.currentTarget.innerText;
        const selectedDay = `${this.state.showingDate.year}/${this.state.showingDate.month}/${parseInt(Persian.number.convertPersianNumberToEnglish(targetText) as string)}`;
        const previousDay = this.state.selectedDay ? `${this.state.selectedDay.year}/${this.state.selectedDay.month}/${this.state.selectedDay.day}` : '';

        this.setState({
            selectedDay: {
                year: this.state.showingDate.year,
                month: this.state.showingDate.month,
                day: parseInt(targetText)
            }
        });

        if (this.props.onDaySelected)
            this.props.onDaySelected({
                previousDay: previousDay,
                selectedDay: selectedDay
            } as DatePickerSelectionEvent);
    }

    _handleFocus() {
        if (this.props.onFocus)
            this.props.onFocus();
    }

    _handleBlur() {
        if (this.props.onBlur)
            this.props.onBlur();
    }

    //#endregion

    //#region Component Methods

    public render() {
        return <div className="datepicker"
                    onFocus={() => this._handleFocus()}
                    onBlur={() => this._handleBlur()}>
            {this.createHeader()}
            {DatePicker.createWeekRow()}
            {this.createDaysRows()}
        </div>
    }

    private createHeader() {
        return <div className="datepicker-header">
            <a onClick={this.goToPrevMonth} className="datepicker-btn"
               style={{float: 'right'}}>»</a>
            <a onClick={this.goToNextMonth} className="datepicker-btn"
               style={{float: 'left'}}>«</a>
            <a onClick={this.goToCurrentMonth} className="datepicker-btn-2"
               style={{float: 'left'}}>امروز</a>
            <span className="datepicker-header-text">
                {this.state.showingDate.year} {Persian.date.monthNames[this.state.showingDate.month - 1]}
            </span>
        </div>
    }

    private static createWeekRow() {
        return <div className="datepicker-week-name">
            {Persian.date.weekNames.map((wn, ix) => <span key={"week" + ix}>{wn[0]}</span>)}
        </div>
    }

    private createDaysRows() {
        const fday = Persian.date.getJalaliMonthFirstWeekDay(this.state.showingDate.year, this.state.showingDate.month);
        const mCount = Persian.date.getJalaliMonthDaysCount(this.state.showingDate.year, this.state.showingDate.month);
        const prevMCount = Persian.date.getJalaliMonthDaysCount(this.state.showingDate.year, this.state.showingDate.month);

        const rows = [];
        for (let i = 0; i < 6; i++) {
            const cells = [];
            for (let j = 0; j < 7; j++) {

                let isOutOfMonth = false;
                let dayNumber = i * 7 + j - fday + 1;
                if (dayNumber < 1) {
                    dayNumber += prevMCount;
                    isOutOfMonth = true;
                } else if (dayNumber > mCount) {
                    dayNumber -= mCount;
                    isOutOfMonth = true;
                }
                const isToday = !isOutOfMonth &&
                    this.state.showingDate.year == this.state.today.year &&
                    this.state.showingDate.month == this.state.today.month &&
                    dayNumber == this.state.today.day;
                const isSelected = !isOutOfMonth && this.state.selectedDay != undefined &&
                    this.state.showingDate.year == this.state.selectedDay.year &&
                    this.state.showingDate.month == this.state.selectedDay.month &&
                    dayNumber == this.state.selectedDay.day;

                const tdClassName = "" +
                    (isToday ? ' today' : '') +
                    (isOutOfMonth ? ' off' : '') +
                    (isSelected ? ' selected' : '');

                cells.push(
                    <span key={i + '_' + j} className={tdClassName} onClick={this.onDayClick}>{dayNumber}</span>
                )
            }
            rows.push(<div key={i} className="datepicker-week">{cells}</div>)
        }
        return rows;
    }

    //#endregion
}

