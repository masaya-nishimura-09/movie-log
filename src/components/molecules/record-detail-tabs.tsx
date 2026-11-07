"use client";

import { Tabs } from "@base-ui/react/tabs";
import type { ReactNode } from "react";

type RecordDetailTabsProps = {
  tabs: { value: string; label: string; content: ReactNode }[];
};

export function RecordDetailTabs({ tabs }: RecordDetailTabsProps) {
  return (
    <Tabs.Root defaultValue={tabs[0]?.value} className="flex flex-col gap-6">
      <Tabs.List className="flex gap-6 border-input border-b">
        {tabs.map((tab) => (
          <Tabs.Tab
            key={tab.value}
            value={tab.value}
            className="-mb-px border-transparent border-b-2 pb-2.5 font-bold text-[15px] text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring data-active:border-primary data-active:text-foreground 2xl:text-lg"
          >
            {tab.label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {tabs.map((tab) => (
        <Tabs.Panel
          key={tab.value}
          value={tab.value}
          className="flex min-w-0 flex-col gap-6.5 outline-none"
        >
          {tab.content}
        </Tabs.Panel>
      ))}
    </Tabs.Root>
  );
}
