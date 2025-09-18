'use client';

import { Disclosure } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  question: string;
  answer: string;
}

interface Props {
  items: FAQItem[];
}

export default function FAQAccordion({ items }: Props) {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Disclosure key={item.question} as="div" className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-900">
          {({ open }) => (
            <>
              <Disclosure.Button className="flex w-full items-center justify-between gap-4 text-left">
                <span className="text-lg font-semibold text-slate-900 dark:text-white">{item.question}</span>
                <ChevronDownIcon
                  className={`h-6 w-6 transition-transform ${open ? 'rotate-180 text-brand' : 'text-slate-500'}`}
                />
              </Disclosure.Button>
              <Disclosure.Panel className="mt-3 text-slate-600 dark:text-slate-300">
                {item.answer}
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>
      ))}
    </div>
  );
}
