"use client";

import { useState } from "react";
import type { MinisterCard } from "@gnarly/lib";
import AdminInlineImageUpload from "@/components/admin/AdminInlineImageUpload";
import AdminThumb from "@/components/admin/AdminThumb";

type Props = {
  initialCards: MinisterCard[];
};

function emptyCard(index: number): MinisterCard {
  return {
    id: index,
    name: "",
    title: "",
    image: "/images/logos/logo-2.png",
    certificateUrl: "",
  };
}

export default function AdminRecommendationCardsEditor({ initialCards }: Props) {
  const [cards, setCards] = useState<MinisterCard[]>(
    initialCards.length ? initialCards : [emptyCard(1)],
  );

  const update = (index: number, patch: Partial<MinisterCard>) => {
    setCards((prev) => prev.map((c, i) => (i === index ? { ...c, ...patch } : c)));
  };

  const addCard = () => {
    setCards((prev) => [...prev, emptyCard(prev.length + 1)]);
  };

  const removeCard = (index: number) => {
    setCards((prev) => (prev.length <= 1 ? prev : prev.filter((_, i) => i !== index)));
  };

  return (
    <div className="space-y-4">
      <input type="hidden" name="cards_json" value={JSON.stringify(cards)} readOnly />

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-800">Recommendation cards</p>
        <button
          type="button"
          onClick={addCard}
          className="rounded-md bg-slate-800 px-3 py-1.5 text-xs font-semibold text-white"
        >
          + Add card
        </button>
      </div>

      <div className="space-y-4">
        {cards.map((card, index) => {
          const imgSrc =
            card.image?.startsWith("/") || card.image?.startsWith("http")
              ? card.image
              : `/${card.image ?? "images/logos/logo-2.png"}`;

          return (
            <article
              key={`${card.id}-${index}`}
              className="rounded-xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <AdminThumb src={imgSrc} alt={card.name} size="lg" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      {card.name || `Card ${index + 1}`}
                    </p>
                    <p className="text-xs text-slate-500">{card.title || "No title yet"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeCard(index)}
                  className="text-xs text-red-600 hover:underline"
                  disabled={cards.length <= 1}
                >
                  Remove
                </button>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Name</span>
                  <input
                    className="admin-input w-full"
                    value={card.name}
                    onChange={(e) => update(index, { name: e.target.value })}
                  />
                </label>
                <label className="block text-sm md:col-span-2">
                  <span className="mb-1 block font-medium text-slate-700">Title / role</span>
                  <input
                    className="admin-input w-full"
                    value={card.title}
                    onChange={(e) => update(index, { title: e.target.value })}
                  />
                </label>
                <div className="md:col-span-2">
                  <AdminInlineImageUpload
                    label="Photo"
                    value={card.image}
                    onChange={(url) => update(index, { image: url })}
                    bucket="banners"
                  />
                </div>
                <label className="block text-sm">
                  <span className="mb-1 block font-medium text-slate-700">Certificate URL</span>
                  <input
                    className="admin-input w-full"
                    value={card.certificateUrl ?? ""}
                    onChange={(e) => update(index, { certificateUrl: e.target.value })}
                  />
                </label>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
