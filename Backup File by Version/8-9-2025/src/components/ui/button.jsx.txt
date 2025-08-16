export const Button = ({ children, className }) => (
  <button className={`bg-accent hover:bg-hover text-white font-semibold px-4 py-2 rounded ${className}`}>
    {children}
  </button>
);