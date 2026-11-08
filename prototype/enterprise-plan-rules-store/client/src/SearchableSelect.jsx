import { useEffect, useId, useRef, useState } from 'react';

export default function SearchableSelect({ options, value, onChange, required = false, disabled = false, placeholder = 'Select an option' }) {
  const id = useId();
  const inputRef = useRef(null);
  const selected = options.find((option) => option.value === value);
  const [query, setQuery] = useState(selected?.label ?? '');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const matches = options.filter((option) => `${option.label} ${option.searchText ?? ''}`.toLowerCase().includes(query.toLowerCase()));
  const visibleOptions = open && query === selected?.label ? options : matches;

  useEffect(() => {
    setQuery(selected?.label ?? '');
  }, [value, selected?.label]);

  useEffect(() => {
    inputRef.current?.setCustomValidity((required && !selected) || (query && query !== selected?.label) ? 'Select an option from the list.' : '');
  }, [required, selected, query]);

  useEffect(() => {
    if (open && visibleOptions[active]) {
      document.getElementById(`${id}-option-${active}`)?.scrollIntoView?.({ block: 'nearest' });
    }
  }, [open, active, id, visibleOptions.length]);

  function choose(option) {
    onChange(option.value);
    setQuery(option.label);
    setOpen(false);
    setActive(0);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!open) {
        setOpen(true);
        setActive(0);
      } else if (visibleOptions.length) {
        setActive((current) => (current + (event.key === 'ArrowDown' ? 1 : -1) + visibleOptions.length) % visibleOptions.length);
      }
    } else if (event.key === 'Enter' && open) {
      event.preventDefault();
      if (visibleOptions[active]) choose(visibleOptions[active]);
    } else if (event.key === 'Escape' && open) {
      event.preventDefault();
      setOpen(false);
      setQuery(selected?.label ?? '');
    }
  }

  return (
    <div className="searchable-select">
      <input
        ref={inputRef}
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-listbox`}
        aria-autocomplete="list"
        aria-activedescendant={open && visibleOptions[active] ? `${id}-option-${active}` : undefined}
        autoComplete="off"
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        value={query}
        onFocus={() => { setOpen(true); setActive(0); }}
        onClick={() => setOpen(true)}
        onChange={(event) => {
          setQuery(event.target.value);
          setOpen(true);
          setActive(0);
        }}
        onKeyDown={handleKeyDown}
        onBlur={() => { setOpen(false); setQuery(selected?.label ?? ''); }}
      />
      {open && <div className="select-popup">
        <div id={`${id}-listbox`} role="listbox" className="select-options">
          {visibleOptions.map((option, index) => <div
            id={`${id}-option-${index}`}
            key={option.value}
            role="option"
            aria-selected={option.value === value}
            className={index === active ? 'select-option active' : 'select-option'}
            onMouseDown={(event) => event.preventDefault()}
            onMouseEnter={() => setActive(index)}
            onClick={(event) => { event.preventDefault(); choose(option); }}
          >{option.label}</div>)}
        </div>
        {visibleOptions.length === 0 && <div className="select-empty">No matching options.</div>}
      </div>}
    </div>
  );
}
