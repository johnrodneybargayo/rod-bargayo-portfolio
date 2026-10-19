"use client";

import { useState } from "react";
import { uid, useBump } from "./shared";

const BUYERS = ["Mara Villanueva", "Theo Lindqvist", "Ana Okafor", "Kenji Morita", "Lucia Ferraro", "Dev Raman"];
const PURCHASES = [240, 480, 600, 360];
const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const RATE = 0.2;

export default function ReferralsDemo() {
    const [stats, setStats] = useState({ clicks: 148, signups: 9, earned: 384, n: 0 });
    const [list, setList] = useState([
        { id: "r1", name: "Jordan Reyes", status: "paid", amount: 96 },
        { id: "r2", name: "Priya Shah", status: "approved", amount: 120 },
        { id: "r3", name: "Sam Whitlock", status: "pending", amount: 48 }
    ]);
    const [months, setMonths] = useState([120, 210, 96, 264, 168, 120]);
    const [copyLabel, setCopyLabel] = useState("Copy link");
    const bump = useBump(stats.earned);
    const link = "https://podify.com/?ref=rod-b7k2";

    const simulate = () => {
        const name = BUYERS[stats.n % BUYERS.length];
        const commission = Math.round(PURCHASES[(stats.n + 1) % PURCHASES.length] * RATE);
        setStats(s => ({ clicks: s.clicks + 3, signups: s.signups + 1, earned: s.earned + commission, n: s.n + 1 }));
        setMonths(m => m.map((v, i) => (i === m.length - 1 ? v + commission : v)));
        setList(l => [
            { id: uid(), name, status: "pending", amount: commission, fresh: true },
            ...l.map(r => ({ ...r, fresh: false, status: r.status === "pending" ? "approved" : r.status }))
        ]);
    };

    const copy = async e => {
        try {
            await navigator.clipboard.writeText(link);
            setCopyLabel("Copied");
        } catch {
            e.currentTarget.previousElementSibling?.select();
            setCopyLabel("Press Ctrl+C");
        }
        setTimeout(() => setCopyLabel("Copy link"), 1600);
    };

    const max = Math.max(...months);

    return (
        <>
            <div className="jrl-stats jrl-stats-4">
                <div className="jrl-stat"><span>Link clicks</span><strong>{stats.clicks}</strong></div>
                <div className="jrl-stat"><span>Sign-ups</span><strong>{stats.signups}</strong></div>
                <div className="jrl-stat jrl-stat-hl"><span>Earned</span><strong className={bump}>${stats.earned}</strong></div>
                <div className="jrl-stat"><span>Next payout</span><strong>1st of month</strong></div>
            </div>

            <div className="rf-link">
                <input type="text" readOnly value={link} aria-label="Your referral link" />
                <button type="button" className="jrl-btn" onClick={copy}>{copyLabel}</button>
            </div>

            <div className="jrl-cols">
                <div className="jrl-box">
                    <div className="jrl-box-head">
                        <h4>Referrals</h4>
                        <button className="jrl-link" type="button" onClick={simulate}>Simulate a referral purchase</button>
                    </div>
                    <ul className="rf-list">
                        {list.slice(0, 5).map(r => (
                            <li key={r.id} className={r.fresh ? "is-new" : ""}>
                                <strong>{r.name}</strong>
                                <span className={`rf-status ${r.status}`}>{r.status}</span>
                                <span>${r.amount}</span>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="jrl-box">
                    <h4>Earnings by month</h4>
                    <div className="rf-chart" role="img" aria-label={`Earnings by month: ${months.map((v, i) => `${MONTHS[i]} $${v}`).join(", ")}`}>
                        {months.map((v, i) => (
                            <div key={MONTHS[i]} className="rf-bar" title={`${MONTHS[i]}: $${v}`}>
                                <i style={{ height: `${Math.round((v / max) * 100)}%` }} />
                                <span>{MONTHS[i]}</span>
                            </div>
                        ))}
                    </div>
                    <p className="jrl-small">Commission is 20% of a referred customer&apos;s first purchase. Approved commissions are paid in a monthly batch.</p>
                </div>
            </div>
        </>
    );
}
