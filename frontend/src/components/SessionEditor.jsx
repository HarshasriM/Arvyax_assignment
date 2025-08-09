// import React, { useEffect, useRef, useState } from 'react';
// import api from '../api';
// import { toast } from 'react-toastify';

// /**
//  * SessionEditor - 5s debounce autosave, Save Draft, Publish
//  * Props:
//  * - session: initial session object (may be null for new)
//  * - onSaved(session) optional callback after save
//  */

// export default function SessionEditor({ session: initialSession, onSaved }) {
//   const [title, setTitle] = useState(initialSession?.title || '');
//   const [tagsText, setTagsText] = useState((initialSession?.tags || []).join(', '));
//   const [jsonFileUrl, setJsonFileUrl] = useState(initialSession?.jsonFileUrl || '');
//   const [savingStatus, setSavingStatus] = useState('saved'); // 'saving' | 'saved' | 'idle'
//   const saveTimer = useRef(null);
//   const sessionId = useRef(initialSession?._id || initialSession?.id || null);

// //   const scheduleSave = () => {
// //     if (saveTimer.current) clearTimeout(saveTimer.current);
// //     setSavingStatus('idle');
// //     saveTimer.current = setTimeout(() => saveDraft(), 5000);
// //   };

//   const payload = () => ({
//     id: sessionId.current,
//     title,
//     tags: tagsText.split(',').map(t => t.trim()).filter(Boolean),
//     jsonFileUrl
//   });

//   const saveDraft = async () => {
//     setSavingStatus('saving');
//     try {
//       const res = await api.post('/sessions/my-sessions/save-draft', payload());
//       const s = res.data;
//       sessionId.current = s._id || s.id || sessionId.current;
//       setSavingStatus('saved');
//       toast.success('Draft saved');
//       if (onSaved) onSaved(s);
//       setTitle("");
//       setTagsText([].join(', '));
//       setJsonFileUrl("");
//     } catch (err) {
//       setSavingStatus('idle');
//       toast.error('Auto-save failed');
//       console.error(err);
//     }
//   };

// //   useEffect(() => {
// //     scheduleSave();
// //     return () => {
// //       if (saveTimer.current) clearTimeout(saveTimer.current);
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [title, tagsText, jsonFileUrl]);

//   const manualSave = async () => {
//     // if (saveTimer.current) clearTimeout(saveTimer.current);
//     await saveDraft();
//   };

//   const publish = async () => {
//     try {
//       const res = await api.post('/sessions/my-sessions/publish', payload());
//       toast.success('Published');
//       const s = res.data;
//       sessionId.current = s._id || s.id || sessionId.current;
//       if (onSaved) onSaved(s);
//       setTitle("");
//       setTagsText([].join(', '));
//       setJsonFileUrl("");
//     } catch (err) {
//       toast.error('Publish failed');
//     }
//   };

//   return (
//     <div className="bg-white p-4 rounded-xl shadow-md">
//       <label className="block text-sm font-medium text-gray-700">Title</label>
//       <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Session title"
//         className="w-full p-3 rounded border mt-1 mb-3" />

//       <label className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
//       <input value={tagsText} onChange={(e)=>setTagsText(e.target.value)} placeholder="e.g. relaxation, breathing"
//         className="w-full p-3 rounded border mt-1 mb-3" />

//       <label className="block text-sm font-medium text-gray-700">JSON file URL</label>
//       <input value={jsonFileUrl} onChange={(e)=>setJsonFileUrl(e.target.value)} placeholder="https://..."
//         className="w-full p-3 rounded border mt-1 mb-3" />
//       <div className="text-sm text-gray-600">
//           {savingStatus === 'saving' ? 'Saving…' : savingStatus === 'saved' ? 'All changes saved' : 'Unsaved changes'}
//       </div>
//       <div className="flex items-center justify-center mt-4">
//         <div className='flex space-x-2'>
//           <button onClick={manualSave} className="mr-2 px-4 py-1 rounded bg-gray-200">Save draft</button>
//           <button onClick={publish} className="px-4 py-1 rounded bg-gray-200">Publish</button>
//         </div>
//       </div>
//     </div>
//   );
// }
import React, { useEffect, useRef, useState } from 'react';
import api from '../api';
import { toast } from 'react-toastify';

export default function SessionEditor({ session: initialSession = null, onSaved }) {
  const [title, setTitle] = useState(initialSession?.title || '');
  const [tagsText, setTagsText] = useState((initialSession?.tags || []).join(', '));
  const [jsonFileUrl, setJsonFileUrl] = useState(initialSession?.jsonFileUrl || '');
  const [savingStatus, setSavingStatus] = useState('saved');
  const saveTimer = useRef(null);
  const sessionId = useRef(initialSession?._id || null);

  useEffect(() => {
    // Reset fields if session prop changes
    setTitle(initialSession?.title || '');
    setTagsText((initialSession?.tags || []).join(', '));
    setJsonFileUrl(initialSession?.jsonFileUrl || '');
    sessionId.current = initialSession?._id || null;
  }, [initialSession]);

  const payload = () => ({
    id: sessionId.current,
    title,
    tags: tagsText.split(',').map(t => t.trim()).filter(Boolean),
    jsonFileUrl
  });

  const scheduleSave = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    setSavingStatus('idle');
    saveTimer.current = setTimeout(saveDraft, 5000);
  };

  const saveDraft = async () => {
    
    setSavingStatus('saving');
    try {
      const res = await api.post('/sessions/my-sessions/save-draft', payload());
      sessionId.current = res.data._id || sessionId.current;
      setSavingStatus('saved');
      toast.success('Draft saved');
    //   if (onSaved) onSaved(res.data);
    } catch (err) {
      setSavingStatus('idle');
      toast.error('Save failed');
    }
  };
  const manualSave = async () => {
    // Clear any existing timer
     if (!validateFields()) {
      return; // stop if validation fails
    }
    if (saveTimer.current) clearTimeout(saveTimer.current);
    await saveDraft();
    if (onSaved) onSaved();
  };

  const publish = async () => {
     if (!validateFields()) {
      return; // stop if validation fails
    }
    try {
      const res = await api.post('/sessions/my-sessions/publish', payload());
      toast.success('Published successfully');
      if (onSaved) onSaved(res.data);
    } catch {
      toast.error('Publish failed');
    }
  };
   const validateFields = () => {
    if (!title.trim()) {
      toast.error('Title is required');
      return false;
    }
    if (!tagsText.trim()) {
      toast.error('At least one tag is required');
      return false;
    }
    if (!jsonFileUrl.trim()) {
      toast.error('JSON file URL is required');
      return false;
    }
    return true;
  };

  useEffect(() => {
    scheduleSave();
    return () => clearTimeout(saveTimer.current);
  }, [title, tagsText, jsonFileUrl]);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Session title"
        required
        className="w-full p-3 rounded border mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <label className="block text-sm font-medium text-gray-700">Tags</label>
      <input
        value={tagsText}
        required
        onChange={(e) => setTagsText(e.target.value)}
        placeholder="Comma-separated tags"
        className="w-full p-3 rounded border mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
      />

      <label className="block text-sm font-medium text-gray-700">JSON File URL</label>
      <input
        value={jsonFileUrl}
        required
        onChange={(e) => setJsonFileUrl(e.target.value)}
        placeholder="https://..."
        className="w-full p-3 rounded border mt-1 mb-4 focus:outline-none focus:ring-2 focus:ring-primary"
      />
      <div className="text-xs text-red-500">
          {savingStatus === 'saving'
            ? 'Saving...'
            : savingStatus === 'saved'
            ? 'All changes saved'
            : 'Unsaved changes'}
        </div>
      <div className="flex items-center justify-center mt-6">
        
        <div className="flex space-x-6">
          <button
            onClick={manualSave}
            className="px-4 py-2 bg-yellow-200 rounded hover:bg-yellow-100"
          >
            Save Draft
          </button>
          <button
            onClick={publish}
            className="px-4 py-2 bg-green-200 rounded hover:bg-green-100"
          >
            Publish
          </button>
        </div>
      </div>
    </div>
  );
}
