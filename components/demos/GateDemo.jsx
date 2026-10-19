"use client";

import { useEffect, useState } from "react";
import { Icon } from "../Icons";
import { uid } from "./shared";

const KEY = "rb-demo-gate";
const RESOURCES = [
    { title: "Guided meditation", meta: "Audio, 12 min" },
    { title: "Relationship workbook", meta: "PDF, 18 pages" },
    { title: "Weekly check-in journal", meta: "PDF, 6 pages" }
];

/* browser storage can throw (private mode, blocked site data); never let it break the demo */
const store = {
    read() { try { return JSON.parse(localStorage.getItem(KEY) || "null"); } catch { return null; } },
    write(v) { try { v ? localStorage.setItem(KEY, JSON.stringify(v)) : localStorage.removeItem(KEY); } catch {} }
};

export default function GateDemo() {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState({ name: "", email: "" });
    const [error, setError] = useState("");
    const [opened, setOpened] = useState({});
    const [leads, setLeads] = useState([
        { id: "g1", name: "Hannah", email: "hannah.k@example.com" },
        { id: "g2", name: "Marco", email: "marco.diaz@example.com" }
    ]);

    /* read after mount so server and client render the same first frame */
    useEffect(() => { setUser(store.read()); }, []);

    const submit = e => {
        e.preventDefault();
        const name = form.name.trim();
        const email = form.email.trim();
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        const u = { name, email };
        setUser(u);
        store.write(u);
        setLeads(l => (l.some(x => x.email.toLowerCase() === email.toLowerCase()) ? l : [...l, { id: uid(), name, email, fresh: true }]));
    };

    const forget = () => {
        setUser(null);
        store.write(null);
        setForm({ name: "", email: "" });
    };

    const exportCsv = () => {
        const rows = [["name", "email"], ...leads.map(l => [l.name, l.email])];
        const csv = rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
        const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
        const a = document.createElement("a");
        a.href = url;
        a.download = "leads-demo.csv";
        document.body.append(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 1000);
    };

    return (
        <div className="jrl-cols">
            <div className="jrl-box">
                {!user ? (
                    <div>
                        <h4>Free resources</h4>
                        <p className="jrl-small">Enter your email to unlock them. No password, and you stay recognised next time.</p>
                        <form className="rg-form" onSubmit={submit} noValidate>
                            <input type="text" placeholder="First name" aria-label="First name" autoComplete="off" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
                            <input type="email" placeholder="you@example.com" aria-label="Email" autoComplete="off" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
                            <button type="submit" className="jrl-btn">Get access</button>
                        </form>
                        <p className={`jrl-msg${error ? " is-error" : ""}`} aria-live="polite">{error}</p>
                    </div>
                ) : (
                    <div>
                        <div className="jrl-box-head">
                            <h4>Welcome back, {user.name || "friend"}</h4>
                            <button className="jrl-link" type="button" onClick={forget}>Forget me</button>
                        </div>
                        <p className="jrl-small">Recognised on this device, so the sign-in step is skipped.</p>
                    </div>
                )}

                <ul className={`rg-res${user ? " is-open" : ""}`}>
                    {RESOURCES.map(r => (
                        <li key={r.title} onClick={() => user && setOpened(o => ({ ...o, [r.title]: true }))}>
                            <span className="rg-lock"><Icon name="shield" small /></span>
                            <span><strong>{r.title}</strong><em>{opened[r.title] ? "Opened (demo file)" : r.meta}</em></span>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="jrl-box">
                <div className="jrl-box-head">
                    <h4>Leads (admin)</h4>
                    <button className="jrl-link" type="button" onClick={exportCsv}>Export CSV</button>
                </div>
                <p className="jrl-small">Exported for manual upload to Kajabi.</p>
                <ul className="rg-leads">
                    {leads.slice().reverse().map(l => (
                        <li key={l.id} className={l.fresh ? "is-new" : ""}>
                            <span>{l.name || "(no name)"}</span><span>{l.email}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
