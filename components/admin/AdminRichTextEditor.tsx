"use client";

import { useEffect, useId, useRef, useState } from "react";
import { AdminField } from "@/components/admin/AdminForm";
import { TINYMCE_CONTENT_STYLE } from "@/components/leadership/richTextStyles";

const TINYMCE_BASE = "https://cdn.jsdelivr.net/npm/tinymce@7";

type TinyEditor = {
  getContent: () => string;
  on: (event: string, callback: () => void) => void;
  remove: () => void;
};

type TinyMCEGlobal = {
  init: (config: Record<string, unknown>) => Promise<TinyEditor[]>;
  remove: (selector: string) => void;
};

declare global {
  interface Window {
    tinymce?: TinyMCEGlobal;
  }
}

function loadTinyMCE(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.tinymce) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-tinymce="true"]');
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("TinyMCE failed to load")));
      return;
    }

    const script = document.createElement("script");
    script.src = `${TINYMCE_BASE}/tinymce.min.js`;
    script.dataset.tinymce = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("TinyMCE failed to load"));
    document.head.appendChild(script);
  });
}

type Props = {
  name: string;
  label?: string;
  defaultValue?: string;
  hint?: string;
  height?: number;
  bucket?: string;
  minimal?: boolean;
};

export default function AdminRichTextEditor({
  name,
  label = "Content",
  defaultValue = "",
  hint,
  height = 420,
  bucket = "gallery",
  minimal = false,
}: Props) {
  const reactId = useId().replace(/:/g, "");
  const textareaId = `admin-rte-${name}-${reactId}`;
  const editorRef = useRef<TinyEditor | null>(null);
  const [content, setContent] = useState(defaultValue);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    loadTinyMCE()
      .then(async () => {
        if (!mounted || !window.tinymce) return;

        const plugins = minimal
          ? "lists link code wordcount"
          : "advlist autolink lists link image charmap preview anchor searchreplace visualblocks code fullscreen insertdatetime media table wordcount";

        const toolbar = minimal
          ? "undo redo | bold italic | bullist numlist | link | code"
          : "undo redo | blocks | bold italic underline strikethrough | alignleft aligncenter alignright | bullist numlist outdent indent | link image media table | code preview";

        const editors = await window.tinymce.init({
          selector: `#${textareaId}`,
          height,
          menubar: !minimal,
          plugins,
          toolbar,
          base_url: TINYMCE_BASE,
          suffix: ".min",
          promotion: false,
          branding: false,
          license_key: "gpl",
          content_style: TINYMCE_CONTENT_STYLE,
          paste_remove_styles_if_webkit: false,
          paste_webkit_styles: "all",
          paste_merge_formats: true,
          valid_elements: "*[*]",
          extended_valid_elements: "*[*]",
          setup: (editor: TinyEditor) => {
            editorRef.current = editor;
            editor.on("change input undo redo", () => {
              setContent(editor.getContent());
            });
          },
          images_upload_handler: async (blobInfo: { blob: () => Blob; filename: () => string }) => {
            const fd = new FormData();
            fd.append("file", blobInfo.blob(), blobInfo.filename());
            fd.append("bucket", bucket);
            const res = await fetch("/api/admin/media/upload", { method: "POST", body: fd });
            const json = (await res.json()) as { ok?: boolean; publicUrl?: string; error?: string };
            if (res.ok && json.publicUrl) return json.publicUrl;
            throw new Error(json.error ?? "Image upload failed");
          },
        });

        if (editors[0]) {
          editorRef.current = editors[0];
        }
        if (mounted) setLoading(false);
      })
      .catch((e) => {
        if (mounted) {
          setError(e instanceof Error ? e.message : "Editor failed to load");
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
      window.tinymce?.remove(`#${textareaId}`);
      editorRef.current = null;
    };
  }, [textareaId, height, bucket, minimal]);

  return (
    <AdminField label={label} name={name} hint={hint}>
      <input type="hidden" name={name} value={content} />
      {loading && (
        <div className="flex h-32 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-sm text-slate-500">
          Loading editor…
        </div>
      )}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}. Using plain text fallback.
        </div>
      )}
      <textarea
        id={textareaId}
        defaultValue={defaultValue}
        className={loading ? "sr-only" : "admin-input min-h-[120px] w-full"}
        onChange={(e) => setContent(e.target.value)}
      />
    </AdminField>
  );
}
