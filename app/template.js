// Re-mounts on every navigation in the App Router → page transition (.mb-page in app/motion.css)
export default function Template({ children }) {
  return <div className="mb-page">{children}</div>;
}
