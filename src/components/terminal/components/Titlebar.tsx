import type { DragControls } from "framer-motion";

export default function Titlebar({
  inst,
  onFocus,
  onClose,
  onNew,
  dragControls,
}: {
  inst: { uid: number; z: number; idx: number };
  onFocus: (uid: number) => void;
  onClose: (uid: number) => void;
  onNew: () => void;
  dragControls?: DragControls;
}) {
  return (
    <div
      className="terminal-titlebar"
      style={{ cursor: "grab", userSelect: "none" }}
      onPointerDown={(e) => {
        onFocus(inst.uid);
        // pass native PointerEvent to framer-motion DragControls
        dragControls?.start(e.nativeEvent as PointerEvent);
      }}
    >
      <div className="terminal-dots">
        <button
          className="terminal-dot terminal-dot--red"
          onClick={(e) => {
            e.stopPropagation();
            onClose(inst.uid);
          }}
          title="Fechar"
        />
        <span className="terminal-dot terminal-dot--yellow" title="" />
        <span
          className="terminal-dot terminal-dot--green"
          style={{ cursor: "pointer" }}
          onClick={(e) => {
            e.stopPropagation();
            onNew();
          }}
          title="Novo terminal"
        />
      </div>
      <span className="terminal-title">
        glatz terminal
      </span>
    </div>
  );
}
