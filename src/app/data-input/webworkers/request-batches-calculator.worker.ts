/// <reference lib="webworker" />

import { getBatchedIds } from "../helpers/file-processor";

addEventListener('message', ( event) => {
  postMessage(getBatchedIds(event.data));
});
