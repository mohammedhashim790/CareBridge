export type CalendarEvent = {
    /**
     * Example:
     * date : new Date().getDate() => returns today,
     * events: [
     *         'Lorem Ipsum'
     *     ],
     * bubbleMessage: 1
     */
    date: number;
    events: [] | string[] | number[] | number[][] | string[][][] | number[][][][],
    'bubbleMessage': number | string;
    onClick: (event:CalendarEvent) => void;
}

export type CalendarParams = {
    events: CalendarEvent[];

}
