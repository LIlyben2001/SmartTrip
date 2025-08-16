export const Button = ({ children, className }) => (
  <button className={`bg-orange-500 hover:bg-orange-600 text-white font-semibold px-4 py-2 rounded ${className}`}>
    {children}
  </button>
);