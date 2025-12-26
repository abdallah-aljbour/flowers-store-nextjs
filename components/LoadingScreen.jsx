import { Loader } from "lucide-react";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-[60] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-pandora-pink border-t-transparent rounded-full animate-spin mb-2" />
        <p className="text-sm text-gray-600">جاري التحميل...</p>
      </div>
    </div>
  );
}
