"use client";

import { useState } from "react";
import { uid, useBump } from "./shared";

const STAGES = ["Brief", "Recording", "Editing", "Published"];
const PACKS = [
    { credits: 10, price: "$90" },
    { credits: 25, price: "$210" },
    { credits: 50, price: "$400" }
];
const SERVICES = [
    { name: "Episode edit", cost: 4 },
    { name: "Show notes", cost: 1 },
    { name: "Audiogram", cost: 2 }
];

export default function PortalDemo() {
    const [credits, setCredits] = useState(12);
    const [items, setItems] = useState([
        { id: "a", name: "Episode 41 edit", stage: 2 },
        { id: "b", name: "Show notes, Ep 40", stage: 1 },
        { id: "c", name: "Audiogram, Ep 39", stage: 3 }
    ]);
    const [log, setLog] = useState([
        { id: "l1", src: "stripe", ev: "invoice.paid", note: "Growth plan renewed" },
        { id: "l2", src: "clickup", ev: "taskStatusUpdated", note: "Ep 39 audiogram to Published" }
    ]);
    const [service, setService] = useState(0);
    const [msg, setMsg] = useState({ text: "", error: false });
    const bump = useBump(credits);

    const addLog = (...entries) => setLog(l => [...l, ...entries.map(e => ({ id: uid(), ...e }))]);

    const buy = pack => {
        setCredits(c => c + pack.credits);
        addLog({ src: "stripe", ev: "checkout.session.completed", note: `+${pack.credits} credits (${pack.price})` });
        setMsg({ text: `Payment received. ${pack.credits} credits added.`, error: false });
    };

    const order = () => {
        const s = SERVICES[service];
        if (credits < s.cost) {
            setMsg({ text: `Not enough credits. Top up to order ${s.name.toLowerCase()}.`, error: true });
            return;
        }
        setCredits(c => c - s.cost);
        setItems(list => [{ id: uid(), name: `${s.name}, new request`, stage: 0, fresh: true }, ...list].slice(0, 4));
        addLog(
            { src: "portal", ev: "credits.deducted", note: `-${s.cost} for ${s.name.toLowerCase()}` },
            { src: "clickup", ev: "taskCreated", note: `${s.name} added to the board` }
        );
        setMsg({ text: `${s.name} ordered. ${s.cost} credit${s.cost > 1 ? "s" : ""} used.`, error: false });
    };

    const sync = () => {
        const target = items.find(i => i.stage < 3);
        if (!target) { setMsg({ text: "Everything is published.", error: false }); return; }
        const nextStage = target.stage + 1;
        setItems(list => list.map(i => (i.id === target.id ? { ...i, stage: nextStage, fresh: false } : i)));
        addLog({ src: "clickup", ev: "taskStatusUpdated", note: `${target.name} to ${STAGES[nextStage]}` });
        setMsg({ text: `${target.name} moved to ${STAGES[nextStage]}.`, error: false });
    };

    return (
        <>
            <div className="jrl-stats">
                <div className="jrl-stat jrl-stat-hl"><span>Credit balance</span><strong className={bump}>{credits}</strong></div>
                <div className="jrl-stat"><span>In production</span><strong>{items.filter(i => i.stage < 3).length}</strong></div>
                <div className="jrl-stat"><span>Plan</span><strong>Growth</strong></div>
            </div>

            <div className="jrl-cols">
                <div className="jrl-box">
                    <div className="jrl-box-head">
                        <h4>Deliverables</h4>
                        <button className="jrl-link" type="button" onClick={sync}>Simulate ClickUp update</button>
                    </div>
                    <ul className="pp-list">
                        {items.map(item => (
                            <li key={item.id} className={`pp-item${item.fresh ? " is-new" : ""}`}>
                                <div className="pp-item-top">
                                    <strong>{item.name}</strong>
                                    <span className={`pp-stage${item.stage === 3 ? " is-done" : ""}`}>{STAGES[item.stage]}</span>
                                </div>
                                <div className="pp-steps">
                                    {STAGES.map((s, k) => <i key={s} className={k <= item.stage ? "on" : ""} />)}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                <div className="jrl-box">
                    <h4>Top up credits</h4>
                    <div className="pp-packs">
                        {PACKS.map(p => (
                            <button key={p.credits} type="button" className="pp-pack" onClick={() => buy(p)}>
                                <strong>{p.credits}</strong><span>{p.price}</span>
                            </button>
                        ))}
                    </div>
                    <h4 className="jrl-mt">Order a service</h4>
                    <div className="pp-order">
                        <select aria-label="Service" value={service} onChange={e => setService(Number(e.target.value))}>
                            {SERVICES.map((s, i) => (
                                <option key={s.name} value={i}>{s.name} ({s.cost} credit{s.cost > 1 ? "s" : ""})</option>
                            ))}
                        </select>
                        <button type="button" className="jrl-btn" onClick={order}>Order</button>
                    </div>
                    <p className={`jrl-msg${msg.error ? " is-error" : ""}`} aria-live="polite">{msg.text}</p>
                </div>
            </div>

            <div className="jrl-log">
                <span className="jrl-log-title">Webhook log</span>
                <ol>
                    {log.slice(-6).reverse().map(e => (
                        <li key={e.id}><span>{e.src}</span> {e.ev}  {e.note}</li>
                    ))}
                </ol>
            </div>
        </>
    );
}
