import Link from "next/link";
import { notFound } from "next/navigation";
import AdminNotConfigured from "@/components/admin/AdminNotConfigured";
import { AdminDeleteForm } from "@/components/admin/AdminConfirmDelete";
import {
  AdminCheckbox,
  AdminForm,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminSubmit,
} from "@/components/admin/AdminForm";
import AdminSlugField from "@/components/admin/AdminSlugField";
import { deleteTeamCategoryByIdFormAction, saveTeamCategoryAction } from "@/lib/admin/actions";
import { getAdminTeamCategory } from "@/lib/admin/data";

type Params = { params: Promise<{ id: string }> };

export default async function AdminTeamCategoryEditPage({ params }: Params) {
  const { id } = await params;
  const category = await getAdminTeamCategory(id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <AdminNotConfigured />
      <AdminPageHeader
        title={category.name}
        actions={
          <Link href="/admin/leadership/categories/" className="text-sm text-slate-500 hover:text-slate-800">
            ← Categories
          </Link>
        }
      />
      <section className="admin-card p-6">
        <AdminForm action={saveTeamCategoryAction.bind(null, id)}>
          <AdminSlugField
            nameLabel="Category name"
            nameField="name"
            slugField="slug"
            nameDefault={category.name}
            slugDefault={category.slug}
            required
          />
          <div className="grid gap-4 md:grid-cols-2">
            <AdminSelect
              label="Display layout"
              name="display_style"
              defaultValue={category.display_style ?? "grid"}
              options={[
                { value: "carousel", label: "Carousel (top section)" },
                { value: "grid", label: "Grid (list or standalone)" },
              ]}
            />
            <AdminInput
              label="Sort order"
              name="sort_order"
              type="number"
              defaultValue={String(category.sort_order ?? 0)}
            />
          </div>
          <AdminInput
            label="Page placement note"
            name="description"
            defaultValue={category.description ?? ""}
            placeholder='Use "standalone" for a separate bottom section'
          />
          <AdminCheckbox name="is_enabled" label="Show on website" defaultChecked={category.is_enabled} />
          <AdminSubmit />
        </AdminForm>
        <div className="mt-6 border-t border-slate-200 pt-6">
          <AdminDeleteForm
            action={deleteTeamCategoryByIdFormAction.bind(null, id)}
            label="Delete category"
            message={`Delete "${category.name}"? Categories with members cannot be deleted.`}
          />
        </div>
      </section>
    </div>
  );
}
