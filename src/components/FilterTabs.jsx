export default function FilterTabs({ active, onChange }) {
  const tabs = [
    { label: "Tout", value: "all" },
    { label: "Article", value: "article" },
    { label: "Vidéo", value: "video" },
    { label: "Podcast", value: "podcast" },
  ];
  return (
    <div className="flex gap-2 my-4">
      {tabs.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`flex-1 px-3 py-2 rounded-lg border text-sm font-medium transition-all
            ${active === tab.value ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-200"}`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
} 