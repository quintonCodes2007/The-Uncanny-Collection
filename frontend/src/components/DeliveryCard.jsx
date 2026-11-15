import { Truck, PackageCheck, Clock } from "lucide-react";

const DeliveryCard = () => {
  return (
    <div className="overflow-hidden rounded-xl border border-[#69404b] bg-[#21151f] p-4">
      <div className="flex items-center gap-2">
        <Truck size={20} className="shrink-0 text-red-400" />

        <h3 className="text-sm font-semibold leading-snug text-red-300">
          Delivery Across Realms
        </h3>
      </div>

      <div className="my-4 border-t border-[#69404b]" />

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <PackageCheck size={16} className="shrink-0 text-red-300" />

          <p className="text-xs font-medium text-gray-200">
            Carefully Sealed Artifacts
          </p>
        </div>

        <p className="mt-1 pl-6 text-[11px] leading-relaxed text-gray-400">
          Containment not guaranteed.
        </p>
      </div>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <Clock size={16} className="shrink-0 text-red-300" />

          <p className="text-xs font-medium text-gray-200">
            Delivery by the Unknown
          </p>
        </div>

        <p className="mt-1 pl-6 text-[11px] leading-relaxed text-gray-400">
          The spirits handle the logistics.
        </p>
      </div>

      <div className="rounded-md border border-red-900/30 bg-[#351823] px-3 py-2.5">
        <p className="text-center text-[11px] leading-relaxed text-red-300">
          We deliver artifacts. The consequences follow.
        </p>
      </div>
    </div>
  );
};

export default DeliveryCard;