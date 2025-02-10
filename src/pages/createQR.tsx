import { useState } from 'react';
import QRCode from 'react-qr-code';
import '../styles/createQR.css';
import { useAuth } from '@/contexts/AuthContext';

const CreateQR = () => {
  const [url, setUrl] = useState('');
  const { loading } = useAuth();
  // const router = useRouter();

  if (loading) {
    return <div>Loading...</div>;
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // The QR code will update automatically when the URL changes
  };

  return (
    <div className="qr-container">
      <h1 className="qr-title">Create QR Code</h1>
      <div className="qr-form-container">
        <form onSubmit={handleSubmit}>
          <div className="qr-input-container">
            <label htmlFor="url" className="qr-input-label">
              Enter URL
            </label>
            <input
              type="url"
              id="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="qr-input"
              placeholder="https://example.com"
              required
            />
          </div>
        </form>
        {url && (
          <div className="qr-code-container">
            <QRCode
              value={url}
              size={256}
              bgColor="#FFFFFF"
              fgColor="#000000"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateQR;
