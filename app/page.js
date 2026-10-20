import { preload } from "react-dom";
import Portfolio from "@/components/Portfolio";
import { SITE } from "@/lib/data";

export default function Home() {
    /* The hero portrait is the largest paint: announce it in <head> so the
       browser starts it before reading the rest of the page. */
    preload("/john_rodney_overview-760.avif", {
        as: "image",
        type: "image/avif",
        fetchPriority: "high",
        imageSrcSet: SITE.portraitAvif,
        imageSizes: SITE.portraitSizes
    });
    return <Portfolio />;
}
