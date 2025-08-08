export default function MessageBox({ message, type }) {
  if (!message) return null;
  return <div className={`message-box show ${type}`}>{message}</div>;
}