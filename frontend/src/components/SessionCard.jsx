import React from 'react';

function SessionCard({ session }) {
  const startTime = new Date(session.start_time);
  const endTime = new Date(session.end_time);
  const duration = ((endTime - startTime) / (1000 * 60 * 60)).toFixed(2) + ' hours';
  const profit = session['cash-out'] - session['buy-in'];

  return (
    <div className="session-card">
      <h3>Session on {startTime.toLocaleString()}</h3>
      <p>Duration: {duration}</p>
      <p>Profit: ${profit}</p>
      <p>Game Type: {session['game-type']}</p>
      <p>Location: {session.location}</p>
    </div>
  );
}

export default SessionCard;