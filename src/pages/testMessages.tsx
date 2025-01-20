import { useState } from 'react';

import '@/styles/testMessages.css';

export default function TestMessages() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('/api/sendMessage', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ phoneNumber, message }),
      });

      const data = await response.json();

      if (response.ok) {
        setStatus('Message sent successfully!');
        setPhoneNumber('');
        setMessage('');
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      setStatus('Error sending message');
      console.error('Error:', error);
    }
  };

  return (
    <div className="test-messages-container">
      <h1 className="test-messages-title">Test WhatsApp Messages</h1>

      <form onSubmit={handleSubmit} className="test-messages-form">
        <div className="form-group">
          <label htmlFor="phoneNumber" className="form-label">
            Phone Number (with country code):
          </label>
          <input
            type="text"
            id="phoneNumber"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="e.g., 5511999999999"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="message" className="form-label">
            Message:
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="form-textarea"
            rows={4}
            required
          />
        </div>

        <button type="submit" className="submit-button">
          Send Message
        </button>
      </form>

      {status && <div className="status-message">{status}</div>}
    </div>
  );
}
