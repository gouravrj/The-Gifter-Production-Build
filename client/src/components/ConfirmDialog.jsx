export default function ConfirmDialog({ open, title, text, onConfirm, onClose }) {
  if (!open) return null;
  return <div className="fixed inset-0 z-[70] grid place-items-center bg-ink/50 p-4" onMouseDown={onClose}><div className="card max-w-md p-6" onMouseDown={(e)=>e.stopPropagation()}><h3 className="text-2xl">{title}</h3><p className="mt-2 text-ink/65">{text}</p><div className="mt-6 flex justify-end gap-3"><button className="btn-secondary" onClick={onClose}>Cancel</button><button className="btn-primary bg-red-700" onClick={onConfirm}>Confirm</button></div></div></div>;
}
