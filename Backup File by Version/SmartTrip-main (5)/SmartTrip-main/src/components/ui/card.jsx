// src/components/ui/card.jsx
export function Card({ className = "", children }) {
  return <div className={`rounded-lg border bg-white ${className}`}>{children}</div>;
}
export function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
