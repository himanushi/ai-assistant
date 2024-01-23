import { signal } from "@preact/signals";

export const token = signal(localStorage.getItem("apiKey") || null);
