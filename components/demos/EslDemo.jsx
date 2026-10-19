"use client";

import { useState } from "react";
import { clock, uid, useBump } from "./shared";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"];
const TIMES = ["9:00", "11:00", "14:00", "16:00", "19:00"];
const TAKEN = new Set(["0-1", "1-3", "2-0", "3-2", "4-4", "1-0", "3-4"]);

function initialSlots() {
    const slots = {};
    DAYS.forEach((_, d) => TIMES.forEach((_, t) => {
        const key = `${d}-${t}`;
        slots[key] = TAKEN.has(key) ? "taken" : "open";
    }));
    slots["2-2"] = "mine";
    return slots;
}

export default function EslDemo() {
    const [credits, setCredits] = useState(6);
    const [slots, setSlots] = useState(initialSlots);
    const [log, setLog] = useState([
        { id: "e1", t: "09:12:04", txt: "Admin top-up, package of 8", delta: 8 },
        { id: "e2", t: "09:40:31", txt: "Booked Wed 14:00", delta: -1 },
        { id: "e3", t: "10:02:17", txt: "Booked Mon 9:00", delta: -1 },
        { id: "e4", t: "10:05:55", txt: "Cancelled Mon 9:00, refunded", delta: 1 },
        { id: "e5", t: "10:30:09", txt: "Booked Thu 11:00 (lesson done)", delta: -1 }
    ]);
    const bump = useBump(credits);

    const click = key => {
        const [d, t] = key.split("-").map(Number);
        const label = `${DAYS[d]} ${TIMES[t]}`;
        const state = slots[key];
        if (state === "open") {
            if (credits < 1) {
                setLog(l => [...l, { id: uid(), t: clock(), txt: `Blocked ${label}: no credits`, delta: 0, fresh: true }]);
                return;
            }
            setSlots(s => ({ ...s, [key]: "mine" }));
            setCredits(c => c - 1);
            setLog(l => [...l, { id: uid(), t: clock(), txt: `Booked ${label}`, delta: -1, fresh: true }]);
        } else if (state === "mine") {
            setSlots(s => ({ ...s, [key]: "open" }));
            setCredits(c => c + 1);
            setLog(l => [...l, { id: uid(), t: clock(), txt: `Cancelled ${label}, refunded`, delta: 1, fresh: true }]);
        }
    };

    /* the ledger must always add up to the balance */
    const ledgerOk = log.reduce((a, e) => a + e.delta, 0) === credits;

    return (
        <>
            <div className="es-head">
                <div>
                    <h4>Book a lesson</h4>
                    <p className="jrl-small">Click an open slot to book. Click your own booking to cancel and refund the credit.</p>
                </div>
                <span className="es-credits">Credits <strong className={bump}>{credits}</strong></span>
            </div>

            <div className="jrl-cols jrl-cols-wide">
                <div className="es-grid" role="grid" aria-label="Lesson schedule">
                    <span className="es-time" />
                    {DAYS.map(d => <span key={d} className="es-day">{d}</span>)}
                    {TIMES.map((time, t) => [
                        <span key={`t${t}`} className="es-time">{time}</span>,
                        ...DAYS.map((day, d) => {
                            const key = `${d}-${t}`;
                            const state = slots[key];
                            return (
                                <button
                                    key={key}
                                    type="button"
                                    className={`es-slot ${state}`}
                                    disabled={state === "taken"}
                                    aria-label={`${day} ${time}, ${state === "mine" ? "your booking" : state}`}
                                    onClick={() => click(key)}
                                >
                                    {state === "mine" ? "Booked" : state === "open" ? "Open" : ""}
                                </button>
                            );
                        })
                    ])}
                </div>

                <div className="jrl-box">
                    <div className="jrl-box-head">
                        <h4>Admin credit log</h4>
                        <span className="es-check">{ledgerOk ? "Ledger matches balance" : "Mismatch found"}</span>
                    </div>
                    <ol className="es-log">
                        {log.slice().reverse().map(e => (
                            <li key={e.id} className={e.fresh ? "is-new" : ""}>
                                <time>{e.t}</time>
                                <span>{e.txt}</span>
                                <span className={e.delta > 0 ? "plus" : "minus"}>{e.delta > 0 ? "+" : ""}{e.delta}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            <div className="es-legend">
                <span><i className="es-dot es-open" />Open</span>
                <span><i className="es-dot es-mine" />Your booking</span>
                <span><i className="es-dot es-taken" />Taken</span>
            </div>
        </>
    );
}
