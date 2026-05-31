import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import AdminRichTextEditor from "@/components/admin/AdminRichTextEditor";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import AdminSlugField from "@/components/admin/AdminSlugField";
import MediaPicker from "@/components/admin/MediaPicker";
import { saveVisionBlockAction } from "@/lib/admin/actions";
import { getAdminVisionPillar } from "@/lib/admin/data";

type Params = { params: Promise<{ id: string }> };

export default async function AdminVisionBlockNewPage({ params }: Params) {
  const { id: pillarId } = await params;
  const pillar = await getAdminVisionPillar(pillarId);
  if (!pillar) notFound();

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={`New story — ${pillar.title}`}
        actions={
          <Link href={`/admin/vision/${pillarId}/`} className="text-sm text-slate-500 hover:text-slate-800">
            ← {pillar.title}
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveVisionBlockAction.bind(null, pillarId, null)}>
          <MediaPicker name="block" label="Story image" bucket="banners" />
          <AdminSlugField
            nameLabel="Title"
            nameField="title"
            slugField="slug"
            nameDefault=""
            slugDefault=""
            required
          />
          <AdminSelect
            label="Block type"
            name="block_type"
            defaultValue="story"
            options={[
              { value: "featured", label: "Featured story" },
              { value: "large", label: "Large card" },
              { value: "story", label: "Small story" },
            ]}
          />
          <AdminInput label="Caption / excerpt" name="excerpt" />
          <AdminInput label="Author" name="author" />
          <AdminInput label="Read time (minutes)" name="read_time" type="number" defaultValue="5" />
          <AdminInput label="Sort order" name="sort_order" type="number" defaultValue="0" />
          <AdminRichTextEditor name="body" label="Story body" defaultValue="" bucket="banners" />
          <AdminCheckbox name="is_enabled" label="Published on site" defaultChecked />
          <AdminSubmit label="Create story block" />
        </AdminForm>
      </section>
    </div>
  );
}
