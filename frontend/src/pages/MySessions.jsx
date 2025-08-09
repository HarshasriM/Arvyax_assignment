import React, { useEffect, useState } from 'react';
import api from '../api';
import { useAuth } from '../features/auth/AuthProvider';
import SessionEditor from '../components/SessionEditor';

export default function MySessions() {
  const [sessions, setSessions] = useState([]);
  const [editing, setEditing] = useState(null);
  const { user } = useAuth();

  const load = async () => {
    try {
      const res = await api.get('/sessions/my-sessions');
      setSessions(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleCreate = () => {
    setEditing({ title: '', tags: [], jsonFileUrl: '' });
  };

  const handleEdit = (session) => {
    setEditing(session);
  };

  const onSaved = () => {
    load();
    setEditing(null);
  };

  return (
    <div className="min-h-screen  py-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Session list */}
        <div className="lg:col-span-2 bg-white p-6 rounded-xl  shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">My Sessions</h2>
            <button
              onClick={handleCreate}
              className="px-4 py-2 rounded-lg bg-green-300 hover:bg-green-200 transition"
            >
              + New Session
            </button>
          </div>

          {sessions.length ? (
            <div className="space-y-4">
              {sessions.map((s) => (
                <div
                  key={s._id}
                  className="flex items-center justify-between p-4 bg-gray-100 hover:bg-gray-200 rounded-lg shadow-sm transition"
                >
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{s.title}</h3>
                    <p className="text-sm text-gray-500">{s.tags?.join(', ') || 'No tags'}</p>
                    {s.jsonFileUrl ? (
                        <a
                        href={s.jsonFileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-sm text-blue-600 hover:text-violet-700 truncate max-w-xs"
                        title={s.jsonFileUrl} // shows full link on hover
                        >
                        JsonFile : {s.jsonFileUrl}
                        </a>
                    ) : (
                        <span className="text-sm text-gray-400">No file linked</span>
                    )}
                  </div>
                  <div className="flex items-center space-x-3">
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${
                        s.status === 'published'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {s.status}
                    </span>
                    <button
                      onClick={() => handleEdit(s)}
                      className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-sm"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No sessions yet.</p>
          )}
        </div>

        {/* Editor panel */}
        <div className="lg:col-span-1">
          {editing && (
            <div className="bg-white p-6 rounded-xl shadow-md sticky top-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {editing._id ? 'Edit Session' : 'New Session'}
                </h3>
                <button
                  onClick={() => setEditing(null)}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                 ❌
                </button>
              </div>
              <SessionEditor session={editing} onSaved={onSaved} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
