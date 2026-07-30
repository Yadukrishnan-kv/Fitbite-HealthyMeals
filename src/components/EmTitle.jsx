/**
 * Renders a heading where one phrase is wrapped in <em>, reproducing the
 * original static markup (e.g. "We Believe <em>Eating Healthy</em> Should…").
 *
 * The admin edits a plain `title` string plus an `em` phrase; we split the
 * title around the first occurrence of `em`. If `em` is empty or not found,
 * the whole title renders as plain text — so headings never break.
 */
export default function EmTitle({ title = '', em = '', ...rest }) {
  if (!em) return <>{title}</>;

  const idx = title.indexOf(em);
  if (idx === -1) return <>{title}</>;

  const before = title.slice(0, idx);
  const after = title.slice(idx + em.length);

  return (
    <>
      {before}
      <em {...rest}>{em}</em>
      {after}
    </>
  );
}
