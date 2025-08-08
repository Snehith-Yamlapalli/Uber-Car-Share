// src/App.jsx  (or Maincode.jsx — use whichever file is your entry)
import React, { useEffect, useState, useRef } from 'react';
import firebase, { newauth, newdb } from './MainFirebase'; // NOTE: default firebase + auth,db
import { useLocation } from 'react-router-dom';import "../App.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';

// create a stable-ish gradient color from uid (or string)
function avatarGradient(key) {
  let h = 0;
  for (let i = 0; i < (key || '').length; i++) {
    h = key.charCodeAt(i) + ((h << 5) - h);
  }
  const h1 = Math.abs(h) % 360;
  const h2 = (h1 + 40) % 360;
  return `linear-gradient(135deg, hsl(${h1} 70% 45%), hsl(${h2} 70% 55%))`;
}

// friendly short "time ago" (very small)
function timeAgo(ts) {
  if (!ts) return '';
  const diff = (Date.now() - ts) / 1000;
  if (diff < 60) return `${Math.floor(diff)}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return new Date(ts).toLocaleDateString();
}



// ... rest of App (I kept your previous logic, but replaced newauth() -> auth)
export default function App() {
   const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const messagesRefLocal = useRef(null);
  const presenceRefLocal = useRef(null);

  const { state } = useLocation();
  const destination = state?.destination ?? null;

  useEffect(() => {
    if(destination === null)
    {
      navigate("/Rides")
    }
    const unregister = newauth.onAuthStateChanged(async user => {
      setCurrentUser(user);
      if (user) {
        const pRef = newdb.ref('presence/' + user.uid);
        presenceRefLocal.current = pRef;
        await pRef.set({ uid: user.uid, displayName: user.displayName || user.email || 'User', lastSeen: Date.now(), online: true });
        pRef.onDisconnect().update({ online: false, lastSeen: Date.now() });
      } else {
        setSelectedUser(null);
        setMessages([]);
      }
    });
    return () => unregister && unregister();
  }, [destination]);

  useEffect(() => {
    const ref = newdb.ref('presence');
    ref.on('value', snap => {
      const val = snap.val() || {};
      const arr = Object.keys(val).map(k => val[k]).filter(x => x.uid);
      setUsers(arr);
    });
    return () => ref.off();
  }, []);

  useEffect(() => {
    if (!currentUser || !selectedUser) { setMessages([]); return; }
    const convId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const messagesRef = newdb.ref('messages/' + convId);
    messagesRefLocal.current = messagesRef;
    messagesRef.limitToLast(200).on('value', snap => {
      const v = snap.val() || {};
      const arr = Object.keys(v).map(k => ({ _id: k, ...v[k] })).sort((a, b) => a.timestamp - b.timestamp);
      setMessages(arr);
    });
    return () => messagesRefLocal.current && messagesRefLocal.current.off();
  }, [currentUser, selectedUser]);

  const handleSelectUser = (u) => {
    if (!currentUser) {
      alert('Please sign in first.');
      return;
    }
    if (u.uid === currentUser.uid) { setSelectedUser(null); setMessages([]); return; }
    setSelectedUser(u);
  };

  const handleSend = async (text) => {
    if (!currentUser || !selectedUser) return;
    const convId = [currentUser.uid, selectedUser.uid].sort().join('_');
    const ref = newdb.ref('messages/' + convId);
    const newMsgRef = ref.push();
    await newMsgRef.set({
      senderId: currentUser.uid,
      text,
      timestamp: Date.now()
    });
  };

  // UI components (UserList + ChatWindow) can remain the same as your scaffold
  return (
    /* Your component JSX — keep the layout you had: col-md-4 users, col-md-8 chats */
    <div className="row g-0 shadow-sm rounded overflow-hidden" style={{ height: '80vh' }}>
      <div className="col-md-4 bg-white p-3">
        <div className="d-flex align-items-center mb-3">
          <h5 className="mb-0">People</h5>
          <small className="text-muted ms-auto">Online {users.filter(u => u.online).length}</small>
        </div>

        {/* ... */}
<div className="list-group list-group-flush users-scroll">
  {users
    .filter(u => u.uid !== currentUser?.uid)    // <-- filter out self
    .map(u => {
      const isActive = selectedUser && selectedUser.uid === u.uid;
      const lastSeenText = u.online ? 'Online' : ('Last seen ' + new Date(u.lastSeen || 0).toLocaleString());
      const initials = (u.displayName || 'U').split(' ').map(s=>s[0]).slice(0,2).join('').toUpperCase();
      const lastMsg = u.lastMessage || '';

      return (
        <button
          key={u.uid}
          type="button"
          onClick={() => handleSelectUser(u)}
          className={`list-group-item list-group-item-action d-flex gap-3 py-2 ${isActive ? 'active-user' : ''}`}
          aria-current={isActive ? "true" : "false"}
        >
          {/* avatar + online dot */}
          <div className="avatar-wrapper">
            <div className="avatar" style={{background: avatarGradient(u.uid)}}>
              <span className="avatar-initials">{initials}</span>
              <span className={`online-dot ${u.online ? 'online' : 'offline'}`} aria-hidden="true" />
            </div>
          </div>

          {/* text */}
          <div className="flex-grow-1 min-width-0">
            <div className="d-flex w-100 justify-content-between">
              <h6 className="mb-0 text-truncate user-name">{u.displayName || 'Unnamed'}</h6>
              <small className="text-muted">{u.online ? '' : timeAgo(u.lastSeen)}</small>
            </div>
            <p className="mb-0 text-truncate user-sub text-muted">{ lastMsg || lastSeenText }</p>
          </div>
        </button>
      );
  })}
</div>
{/* ... */}

      </div>
      <div className="col-md-8 bg-light right-panel d-flex flex-column">
        <div className="chat-header d-flex align-items-center px-3 py-2 border-bottom bg-white">
          {selectedUser ? (
            <>
              <div className="me-3">
                <div className="avatar-sm" style={{ background: avatarGradient(selectedUser.uid) }}>
                  <span className="avatar-initials-sm">{(selectedUser.displayName || 'U').split(' ').map(s => s[0]).slice(0, 2).join('').toUpperCase()}</span>
                  <span className={`online-dot ${selectedUser.online ? 'online' : 'offline'}`} />
                </div>
              </div>
              <div>
                <div className="fw-bold">{selectedUser.displayName || 'Unnamed'}</div>
                <small className="text-muted">{selectedUser.online ? 'Online' : 'Last seen ' + new Date(selectedUser.lastSeen || 0).toLocaleString()}</small>
              </div>
              <div className="ms-auto">
                {/* action icons (you can wire these) */}
                <button className="btn btn-sm btn-outline-secondary me-2">⋯</button>
                <button className="btn btn-sm btn-outline-secondary">⚙</button>
              </div>
            </>
          ) : (
            <div className="px-3 py-2 text-muted">Select a user to view chat</div>
          )}
        </div>

        {/* messages area */}
        <div className="flex-grow-1 messages p-3" id="messagesScroll">
          {!selectedUser ? (
            <div className="text-center text-muted mt-5">No conversation selected</div>
          ) : (
            messages.length === 0 ? (
              <div className="text-center text-muted mt-5">No messages yet — say hello 👋</div>
            ) : (
              messages.map(m => {
                const me = m.senderId === (currentUser && currentUser.uid);
                return (
                  <div key={m._id} className={`d-flex mb-2 ${me ? 'justify-content-end' : 'justify-content-start'}`}>
                    <div className={`message-bubble ${me ? 'me' : 'other'}`}>
                      <div className="msg-text">{m.text}</div>
                      <div className="msg-time">{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                  </div>
                );
              })
            )
          )}
        </div>

        {/* composer */}
        <div className="composer border-top bg-white p-3">
          <form className="d-flex gap-2" onSubmit={(e) => { e.preventDefault(); const t = e.target.elements.msg.value.trim(); if (t) { handleSend(t); e.target.reset(); } }}>
            <button type="button" className="btn btn-light">😊</button>
            <input name="msg" className="form-control" placeholder={selectedUser ? `Message ${selectedUser.displayName || ''}` : 'Select a user to message'} disabled={!selectedUser} />
            <button className="btn btn-primary" type="submit" disabled={!selectedUser}>Send</button>
          </form>
        </div>
      </div>
    </div>
  );
}
