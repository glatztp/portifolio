import React from "react";

export default function InputRow({
  prompt,
  input,
  setInput,
  inputRef,
  onKeyDown,
}: {
  prompt: string;
  input: string;
  setInput: (v: string) => void;
  inputRef: React.RefObject<HTMLInputElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="terminal-input-row">
      <span className="terminal-prompt">{prompt}</span>
      <input
        ref={inputRef}
        className="terminal-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoComplete="off"
        autoCorrect="off"
      />
    </div>
  );
}
