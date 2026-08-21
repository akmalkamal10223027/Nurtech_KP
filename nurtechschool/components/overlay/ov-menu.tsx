"use client";

import { useAppContext } from "../layout/context-provider";
import CLinkScroll from "../custom/c-link-scroll";
import { CONTENT } from "../navbar/constant";
import Close from "./close";

export default function OvMenu() {
  const { closeOverlay } = useAppContext();

  return (
    <div className="flex flex-col h-full bg-background p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-xl font-bold text-secondary-500">Menu</h2>
        <Close />
      </div>

      <nav className="flex flex-col gap-6">
        {CONTENT.map((item, idx) => (
          <CLinkScroll key={idx} to={item.id} onClick={closeOverlay}>
            <h1 className="font-bold text-lg text-secondary-500 hover:text-primary-500 transition-colors">
              {item.label}
            </h1>
          </CLinkScroll>
        ))}
      </nav>
    </div>
  );
}
