export default function CmsHomeBanner() {
  return (
    <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
      Homepage is served from CMS. Edit sections in{" "}
      <a href="/admin/pages/" className="font-semibold underline">
        Admin → Pages → Home
      </a>
      . If sections look incomplete, run Import on Dashboard and enable sections.
    </div>
  );
}
