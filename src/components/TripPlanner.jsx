{/* Travel Style (multi-select) */}
<div className="col-span-12 md:col-span-6">
  <label className="block text-sm font-medium text-gray-700 mb-1">
    Travel Style (choose one or more)
  </label>
  <select
    name="style"
    multiple
    value={form.style || []}
    onChange={(e) => {
      const selected = Array.from(e.target.selectedOptions).map(opt => opt.value);
      setForm((f) => ({ ...f, style: selected }));
    }}
    autoComplete="off"
    className="w-full rounded-lg border border-gray-300 p-3 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500 h-32"
  >
    <option>Foodies</option>
    <option>Culture</option>
    <option>Nature</option>
    <option>Luxury</option>
    <option>Budget</option>
    <option>Family</option>
  </select>
  <p className="mt-1 text-xs text-gray-500">
    Hold <kbd>Ctrl</kbd> (Windows) or <kbd>Cmd</kbd> (Mac) to select multiple.
  </p>
</div>
