export default function SiteTemplate({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="page-template-shell">{children}</div>;
}
