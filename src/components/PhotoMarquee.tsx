import Image from "next/image";
import { photos } from "@/lib/content";

function Track({ reverse, half }: { reverse?: boolean; half: string[] }) {
  return (
    <div className="flex overflow-hidden">
      <div
        className={`flex shrink-0 ${reverse ? "marquee-move-rev" : "marquee-move"}`}
        style={{ willChange: "transform" }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0" aria-hidden={copy === 1}>
            {half.map((src) => (
              <Image
                key={`${copy}-${src}`}
                src={src}
                alt=""
                width={400}
                height={500}
                sizes="(max-width: 640px) 40vw, 22vw"
                className="h-40 sm:h-56 lg:h-64 w-auto object-cover mr-2 sm:mr-3"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function PhotoMarquee() {
  const mid = Math.ceil(photos.length / 2);
  return (
    <section aria-label="Photography" className="bg-ink py-2 sm:py-3 space-y-2 sm:space-y-3">
      <Track half={photos.slice(0, mid)} />
      <Track half={photos.slice(mid)} reverse />
    </section>
  );
}
