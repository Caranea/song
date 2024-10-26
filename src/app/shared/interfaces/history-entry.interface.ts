export interface HistoryEntry {
    activityControls: [string],
    header: string,
    products: [string],
    time: Date,
    title: string,
    titleUrl: string,
}

export interface ReducedHistoryEntry extends HistoryEntry {
    id: string,
    occurrenceCount: number,
    watchDatestamps: Date[],
}