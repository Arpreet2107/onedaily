import React from 'react';
import { format } from 'date-fns';

export default function EntryList({ entries, onDelete }) {
  if (entries.length === 0) {
    return (
      <p className="text-center text-gray-500 text-lg mt-10">
        No entries found.
      </p>
    );
  }

  return (
    <ul className="space-y-4">
      {entries.map(({ id, content, date }) => (
        <li
          key={id}
          className="border border-gray-300 rounded-md p-4 shadow-sm hover:shadow-md transition-shadow duration-150"
        >
          <div className="flex justify-between items-center mb-2">
            <time
              dateTime={date}
              className="text-sm text-indigo-500 font-semibold"
            >
              {date ? format(new Date(date), 'PPP') : 'No date'}
            </time>
            <button
              onClick={() => onDelete(id)}
              aria-label={`Delete entry dated ${date}`}
              className="text-red-600 hover:text-red-800 font-bold text-lg"
              title="Delete Entry"
            >
              &times;
            </button>
          </div>
          <p className="whitespace-pre-wrap">{content}</p>
        </li>
      ))}
    </ul>
  );
}
