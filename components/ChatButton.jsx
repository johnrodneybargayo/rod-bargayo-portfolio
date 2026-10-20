"use client";

import { useEffect, useRef } from "react";
import { Icon } from "./Icons";

/*
 * Brevo Conversations live chat.
 * The widget script (~hundreds of KB) is only added after the visitor's first
 * interaction, or when they press this button, so it never slows the first load.
 * Brevo uses our own button (customWidgetButton) instead of its default one.
 *
 * Set NEXT_PUBLIC_BREVO_CONVERSATIONS_ID in Vercel. Brevo > Conversations >
 * Settings > Widget shows it in the install code as BrevoConversationsID.
 * The ID is public by design (it's in every visitor's browser); it is not an API key.
 */
const CHAT_ID = process.env.NEXT_PUBLIC_BREVO_CONVERSATIONS_ID || "";
const SCRIPT_SRC = process.env.NEXT_PUBLIC_BREVO_CONVERSATIONS_SRC || "https://conversations-widget.brevo.com/brevo-conversations.js";

function loadChat() {
    if (typeof window === "undefined" || window.__jrChatLoaded) return;
    window.__jrChatLoaded = true;

    window.BrevoConversationsSetup = {
        customWidgetButton: ".jr-chat-btn",
        colors: { buttonText: "#102a57", buttonBg: "#ffd936" },
        zIndex: 70
    };
    /* Brevo's standard loader: queue calls until the script arrives */
    window.BrevoConversationsID = CHAT_ID;
    window.BrevoConversations = window.BrevoConversations || function () {
        (window.BrevoConversations.q = window.BrevoConversations.q || []).push(arguments);
    };
    const s = document.createElement("script");
    s.async = true;
    s.src = SCRIPT_SRC;
    document.head.appendChild(s);
}

export default function ChatButton({ ready }) {
    const opened = useRef(false);

    useEffect(() => { if (ready && CHAT_ID) loadChat(); }, [ready]);

    if (!CHAT_ID) return null;

    const open = () => {
        const first = !window.__jrChatLoaded;
        loadChat();
        /* the first click happens before Brevo has attached to the button, so open it ourselves */
        if (first || !opened.current) window.BrevoConversations("openChat", true);
        opened.current = true;
    };

    return (
        <button type="button" className="jr-chat-btn" onClick={open} aria-label="Chat with Rod">
            <Icon name="message" />
            <span className="jr-chat-label">Chat</span>
        </button>
    );
}
