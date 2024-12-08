export const ICONS_ROOT_ID = 'icons-root';

export default function IconsRoot() {
  return (
    <div
      id={ICONS_ROOT_ID}
      style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', padding: 0, margin: 0, border: 0 }}
      aria-hidden={true}
    />
  );
}
