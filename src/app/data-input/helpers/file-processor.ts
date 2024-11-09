import { HistoryEntry, ReducedHistoryEntry } from "../../shared/interfaces/history-entry.interface";

export function getBatchedIds(entries: ReducedHistoryEntry[]): string[][] {
  const batchedIds: string[][] = [];

  for (let i = 0; i < entries.length; i += 50) {
    const videosIds = entries.slice(i, i + 50).map(entry => {
      return entry.id;
    });
    batchedIds.push(videosIds);
  }

  return batchedIds;
}

export function reduceHistoryEntriesAndFindEarliestDate(entries: HistoryEntry[]): [ReducedHistoryEntry[], Date] {
  const reducedEntries: ReducedHistoryEntry[] = [];
  let date = new Date();

  for (let i = 0; i < entries.length; i++) {
    if (new Date(entries[i].time) < date) {
      date = new Date(entries[i].time);
    }

    const reducedEntry = reducedEntries.find(reducedEntry => reducedEntry.titleUrl.split('watch?v=')[1] === entries[i].titleUrl.split('watch?v=')[1]);
    if (reducedEntry) {
      reducedEntry.occurrenceCount++;
      reducedEntry.watchDatestamps.push(entries[i].time);
    } else {
      reducedEntries.push({
        ...entries[i],
        id: entries[i].titleUrl.split('?v=')[1],
        occurrenceCount: 1,
        watchDatestamps: [entries[i].time],
      });
    }
  }

  return [reducedEntries.sort((a, b) => b.occurrenceCount - a.occurrenceCount), date];
}