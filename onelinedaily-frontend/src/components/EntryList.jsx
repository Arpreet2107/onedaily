import React from 'react';
import { format, isValid, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

export default function EntryList({ entries = [], onDelete, onEdit }) {
  if (!entries.length) {
    return (
      <p className="text-center text-gray-500 text-lg mt-10 select-none">
        No entries found.
      </p>
    );
  }

  return (
    <ul className="space-y-4" role="list">
      <AnimatePresence>
        {entries.map(({ id, content, date }) => {
          // Parse date string safely
          let displayDate = 'No date';
          if (date) {
            const parsedDate = typeof date === 'string' ? parseISO(date) : date;
            if (isValid(parsedDate)) {
              displayDate = format(parsedDate, 'PPP');
            }
          }

          return (
            <motion.li
              key={id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="border border-gray-300 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-150 bg-white"
              layout
            >
              <div className="flex justify-between items-center mb-2">
                <time
                  dateTime={date}
                  className="text-sm text-indigo-500 font-semibold"
                >
                  {displayDate}
                </time>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => onEdit({ id, content, date })}
                    aria-label={`Edit entry dated ${displayDate}`}
                    className="text-indigo-600 hover:text-indigo-800 font-semibold text-lg px-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    title="Edit Entry"
                  >
                    ✎
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(id)}
                    aria-label={`Delete entry dated ${displayDate}`}
                    className="text-red-600 hover:text-red-800 font-bold text-lg px-2 rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                    title="Delete Entry"
                  >
                    &times;
                  </button>
                </div>
              </div>
              <p className="whitespace-pre-wrap">{content}</p>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
