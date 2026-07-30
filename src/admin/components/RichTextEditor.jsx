import { useRef, useEffect, useState } from 'react';

/**
 * Lightweight dependency-free rich-text editor built on a contentEditable
 * surface + document.execCommand. Emits HTML via onChange. The server
 * sanitizes this HTML before storing/rendering, so only formatting matters here.
 */
const TOOLS = [
  { cmd: 'formatBlock', value: 'H2', label: 'H2', title: 'Heading 2' },
  { cmd: 'formatBlock', value: 'H3', label: 'H3', title: 'Heading 3' },
  { cmd: 'formatBlock', value: 'P', label: '¶', title: 'Paragraph' },
  { cmd: 'bold', label: 'B', title: 'Bold', style: { fontWeight: 700 } },
  { cmd: 'italic', label: 'I', title: 'Italic', style: { fontStyle: 'italic' } },
  { cmd: 'underline', label: 'U', title: 'Underline', style: { textDecoration: 'underline' } },
  { cmd: 'insertUnorderedList', label: '• List', title: 'Bulleted list' },
  { cmd: 'insertOrderedList', label: '1. List', title: 'Numbered list' },
  { cmd: 'formatBlock', value: 'BLOCKQUOTE', label: '❝', title: 'Quote' },
];

export default function RichTextEditor({ value, onChange }) {
  const ref = useRef(null);
  const [focused, setFocused] = useState(false);

  // Sync external value into the DOM only when it differs (avoids caret jumps).
  useEffect(() => {
    if (ref.current && ref.current.innerHTML !== (value || '')) {
      ref.current.innerHTML = value || '';
    }
  }, [value]);

  const exec = (tool) => {
    ref.current?.focus();
    if (tool.value) {
      document.execCommand(tool.cmd, false, tool.value);
    } else {
      document.execCommand(tool.cmd, false, null);
    }
    emit();
  };

  const insertLink = () => {
    const url = window.prompt('Link URL (https://…):');
    if (url) {
      ref.current?.focus();
      document.execCommand('createLink', false, url);
      emit();
    }
  };

  const emit = () => {
    if (ref.current) onChange(ref.current.innerHTML);
  };

  return (
    <div className={`admin-rte${focused ? ' admin-rte--focused' : ''}`}>
      <div className="admin-rte-toolbar">
        {TOOLS.map((t) => (
          <button
            key={t.label}
            type="button"
            className="admin-rte-btn"
            title={t.title}
            style={t.style}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => exec(t)}
          >
            {t.label}
          </button>
        ))}
        <button type="button" className="admin-rte-btn" title="Insert link" onMouseDown={(e) => e.preventDefault()} onClick={insertLink}>
          🔗
        </button>
      </div>
      <div
        ref={ref}
        className="admin-rte-area"
        contentEditable
        suppressContentEditableWarning
        onInput={emit}
        onBlur={() => { setFocused(false); emit(); }}
        onFocus={() => setFocused(true)}
        data-placeholder="Write page content…"
      />
    </div>
  );
}
