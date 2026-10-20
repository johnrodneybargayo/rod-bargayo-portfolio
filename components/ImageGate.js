"use client";

import { createContext } from "react";

/*
 * true when a section's images may load. Sections the visitor hasn't opened
 * hold their images back until the first interaction, so on page load the
 * bandwidth goes to the hero portrait (the largest paint) instead of
 * screenshots and logos that are still off to the side.
 */
export const ImageGate = createContext(true);
