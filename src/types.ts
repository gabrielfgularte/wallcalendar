export type Postit = {
id: string; // uuid
title: string;
description?: string;
time?: string; // "14:00"
};


export type StickyCalendarData = Record<string, Postit[]>;
