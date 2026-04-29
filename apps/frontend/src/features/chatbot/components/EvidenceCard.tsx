interface EvidenceCardProps {
  excerpt?: string | null;
  source?: string | null;
  className?: string;
}

export function EvidenceCard({ excerpt, source, className,}: EvidenceCardProps) {
  if (!excerpt && !source) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg p-3 shadow-sm mt-4 ${className ?? ""}`}>
      {excerpt && (
        <blockquote className="text-base italic text-gray-900 border-l-4 border-[#B20000] pl-3 mb-2">
          {excerpt}
        </blockquote>
      )}
      {source && (
        <div className="text-xs text-[#B20000] font-semibold">
          Fonte: {source} 📄
        </div>
      )}
    </div>
  );
}
