/// <reference lib="webworker" />

import { getBatchedIds, reduceHistoryEntriesAndFindEarliestDate } from "../helpers/file-processor";

addEventListener('message', ( event) => {
  postMessage(reduceHistoryEntriesAndFindEarliestDate(event.data));
});
