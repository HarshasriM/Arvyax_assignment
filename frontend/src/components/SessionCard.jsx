import React from 'react';

export default function SessionCard({ session }) {
  return (
    <div className="p-4 bg-white rounded-xl shadow-sm">
      <h3 className="text-lg mb-4 font-semibold">{session.title}</h3>
      <div className="flex flex-wrap gap-2 mt-2">
        {session.tags?.length > 0 ? (
            session.tags.map((tag, idx) => (
            <span
                key={idx}
                className="bg-green-100 text-green-700 rounded-full py-1 px-3 text-sm"
            >
                {tag}
            </span>
            ))
        ) : (
            <span className="text-sm text-gray-400">No tags</span>
        )}
      </div>
      <div className="mt-2">
        {session.jsonFileUrl ? (
        <a
            href={session.jsonFileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="block text-sm text-blue-600 hover:text-violet-700 truncate max-w-xs"
            title={session.jsonFileUrl} // shows full link on hover
            >
            JsonFile : {session.jsonFileUrl}
            </a>
            ) : (
            <span className="text-sm text-gray-400">No file linked</span>
            )}
       </div>
    </div>
  );
}
