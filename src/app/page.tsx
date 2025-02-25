"use client";

import { Button } from "@/components/ui/button";
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [script, setScript] = useState("");
  const [topic, setTopic] = useState("");
  const topicRef = useRef<HTMLSpanElement>(null);

  const handleInput = () => {
    const text = topicRef.current?.innerText.trim() || "";
    setTopic(text);
  };

  useEffect(() => {
    if (topicRef.current) {
      const range = document.createRange();
      const sel = window.getSelection();
      range.selectNodeContents(topicRef.current);
      range.collapse(false); // Move cursor to end
      sel?.removeAllRanges();
      sel?.addRange(range);
    }
  }, [topic]); // Runs every time topic updates

  const startStreaming = () => {
    console.log(topic);
    if (!topic) return;
    setScript(""); // Clear previous script

    const eventSource = new EventSource(
      `/api/stream?prompt=${encodeURIComponent(topic)}`
    );

    eventSource.onmessage = (event) => {
      if (event.data === "[DONE]") {
        eventSource.close();
      } else {
        setScript((prev) => prev + event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error("EventSource error:", error);
      eventSource.close();
    };
  };

  return (
    <div className="min-h-screen gap-16 font-[family-name:var(--font-geist-sans)]">
      <section className="bg-red-500">
        <header className="w-screen h-20 bg-white/10">
          <div className="max-w-2xl mx-auto h-full px-4">
            <div className=" flex justify-between h-full items-center">
              <h1 className="font-extrabold text-xl text-white">YIG</h1>
            </div>
          </div>
        </header>
        <main className="flex flex-col gap-4 row-start-2 items-center sm:items-start max-w-2xl mx-auto p-4">
          <div className="self-start mt-8">
            <h2 className="font-semibold text-white/90">
              Generate your YouTube intro script
            </h2>
            <p className="font-medium text-sm text-white/70">
              Enter a video topic below and click "Generate"
            </p>
          </div>
          <div className="flex flex-col justify-center pb-8 self-start">
            <div className="flex items-center gap-2 font-black text-4xl text-[#323335]">
              <div>
                Intro Script for{" "}
                <span
                  ref={topicRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleInput}
                  className="inline-block border-b-2 border-white text-white min-w-[200px] focus:outline-none px-1 relative"
                >
                  {topic}
                </span>
              </div>
            </div>
            <Button
              onClick={startStreaming}
              className=" text-xl rounded-[3px] mt-4 self-start w-max shadow-none bg-white hover:bg-white hover:text-red-500 text-red-500 font-black px-6 py-6"
            >
              Generate
            </Button>
          </div>
        </main>
      </section>
      {script && (
        <section>
          <div className="mt-4 max-w-2xl mx-auto rounded  break-words w-full font-[family-name:var(--font-geist-mono)] p-4">
            <h2 className="text-xl font-semibold mb-2">Intro Script:</h2>
            <div
              className="leading-loose"
              dangerouslySetInnerHTML={{
                __html: script.replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        </section>
      )}
    </div>
  );
}
