
import { useState } from "react";
import { MapPin, Ghost, CheckCircle2, ChevronDown } from "lucide-react";

const destinations = [
  {
    name: "Azkaban Prison",
    message:
      "Our couriers have been advised not to make eye contact with the guards.",
  },
  {
    name: "The Ninth Circle of Hell",
    message:
      "Delivery may be delayed by eternal damnation.",
  },
  {
    name: "The Backrooms — Level 0",
    message:
      "Your courier may never find the exit.",
  },
  {
    name: "Castle Dracula",
    message:
      "Deliveries accepted after sunset only.",
  },
  {
    name: "The Shadow Realm",
    message:
      "Tracking information may cease to exist.",
  },
  {
    name: "Mount Doom",
    message:
      "Please keep your receipt away from open lava.",
  },
  {
    name: "Area 51",
    message:
      "Delivery classified. We were never here.",
  },
  {
    name: "The Upside Down",
    message:
      "Expect minor dimensional interference.",
  },
  {
    name: "Silent Hill",
    message:
      "Our driver refuses to enter when the siren sounds.",
  },
  {
    name: "The Bermuda Triangle",
    message:
      "Package disappearance is considered standard service.",
  },
];


const DeliveryDestination = () => {
  const [selected, setSelected] = useState("");
  const [expanded, setExpanded] = useState(false);

  const destination = destinations.find(
    (item) => item.name === selected
  );

  return (
    <section className="overflow-hidden rounded-xl border border-[#69404b] bg-[#281b27] text-white">

      {/* Compact accordion header */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="destination-options"
        className="flex min-h-14 w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-red-950/20"
      >
        <MapPin size={19} className="shrink-0 text-red-400" />

        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-semibold text-red-300">
            Choose Your Destination
          </h2>

          <p className="mt-0.5 truncate text-[11px] text-gray-400">
            {selected || "Select your cursed delivery realm"}
          </p>
        </div>

        <ChevronDown
          size={18}
          className={`shrink-0 text-gray-400 transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Expandable destination controls */}
      {expanded && (
        <div
          id="destination-options"
          className="space-y-3 border-t border-[#69404b] px-3 py-3"
        >
          <label
            htmlFor="delivery-destination"
            className="block text-xs font-medium text-gray-300"
          >
            Delivery Realm
          </label>

          <select
            id="delivery-destination"
            value={selected}
            onChange={(event) => setSelected(event.target.value)}
            className="w-full min-w-0 rounded-lg border border-[#69404b] bg-[#21151f] px-3 py-2.5 text-sm text-gray-200 outline-none focus:border-red-500"
          >
            <option value="">Select a cursed destination...</option>

            {destinations.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          {destination && (
            <div className="rounded-lg bg-red-950/20 p-3">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={15}
                  className="text-emerald-400"
                />
                <span className="text-xs font-semibold text-red-300">
                  Destination Selected
                </span>
              </div>

              <p className="mt-2 text-xs text-gray-300">
                {destination.message}
              </p>
            </div>
          )}

          <div className="flex items-start gap-2">
            <Ghost size={14} className="shrink-0 text-gray-500" />
            <p className="text-[10px] leading-relaxed text-gray-500">
              Delivery is purely fictional. Our couriers
              aren't recognized in this dimension.
            </p>
          </div>
        </div>
      )}

    </section>
  );
};

export default DeliveryDestination;
