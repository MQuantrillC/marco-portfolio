"use client";

import { useState } from "react";
import Image from "next/image";
import { videos } from "@/lib/content";

function Card({ id, i }: { id: string; i: number }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative shrink-0 w-[62vw] xs:w-[46vw] sm:w-[38vw] lg:w-[22vw] aspect-[9/16] bg-ink overflow-hidden snap-center">
      {playing ? (
        <iframe
          src={`https://www.youtube.com/embed/${id}?autoplay=1&mute=1&loop=1&playlist=${id}&playsinline=1`}
          title={`Drone reel ${i + 1}`}
          allow="autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play drone reel ${i + 1}`}
          className="group absolute inset-0 w-full h-full cursor-pointer"
        >
          <Image
            src={`https://img.youtube.com/vi/${id}/hqdefault.jpg`}
            alt=""
            width={480}
            height={360}
            unoptimized
            className="absolute inset-0 w-full h-full object-cover opacity-80 transition-all duration-500 group-hover:opacity-100 group-hover:scale-105"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid place-items-center w-14 h-14 rounded-full bg-paper text-ink transition-colors group-hover:bg-accent group-hover:text-paper">
              <svg width="16" height="18" viewBox="0 0 16 18" fill="currentColor" aria-hidden>
                <path d="M16 9 0 18V0z" />
              </svg>
            </span>
          </span>
          <span className="absolute left-3 bottom-3 type-label text-paper/80">
            {String(i + 1).padStart(2, "0")}
          </span>
        </button>
      )}
    </div>
  );
}

export default function Reel() {
  return (
    <section id="reel" className="bg-ink text-paper px-4 sm:px-6 lg:px-8 py-14 sm:py-20">
      <div className="pt-3 type-label border-t-[5px] border-paper flex justify-between">
        <h2>The reel</h2>
        <span>DJI Mini 4 Pro &#183; Insta360 X4</span>
      </div>

      <p className="mt-8 max-w-2xl font-[family-name:var(--font-serif)] italic text-xl sm:text-2xl text-paper/70">
        Places worth the altitude.
      </p>

      <div className="mt-10 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4">
        {videos.map((id, i) => (
          <Card key={id} id={id} i={i} />
        ))}
      </div>

      <p className="type-label text-paper/40 mt-1">Drag or swipe &#8594;</p>
    </section>
  );
}
