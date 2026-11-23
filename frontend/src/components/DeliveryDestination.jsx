
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

      {/* ======================================
          COMPACT DESTINATION HEADER
      ====================================== */}
      <button
        type="button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
        aria-controls="destination-options"
        className="flex min-h-14 w-full items-center gap-3 px-3 py-2.5 text-left transition-colors hover:bg-red-950/20"
      >
        <MapPin
          size={19}
          className="shrink-0 text-red-400"
        />

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
          className={`shrink-0 text-gray-400 transition-transform duration-300 ease-in-out ${
            expanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* ======================================
          SMOOTH EXPANDING DESTINATION LIST
      ====================================== */}
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-300 ease-in-out ${
          expanded
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <div
            id="destination-options"
            aria-hidden={!expanded}
            inert={!expanded}
            className="border-t border-[#69404b] px-2 py-2"
          >
            <p className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-red-300">
              Available Delivery Realms
            </p>

            {/* Scrollable destination options */}
            <div className="max-h-48 space-y-1 overflow-y-auto overscroll-contain pr-1">
              {destinations.map((item) => {
                const isSelected = selected === item.name;

                return (
                  <button
                    key={item.name}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      setSelected(item.name);
                      setExpanded(false);
                    }}
                    className={`flex min-h-10 w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs transition-colors ${
                      isSelected
                        ? "bg-red-900/40 text-red-200"
                        : "text-gray-300 hover:bg-red-950/30 hover:text-white"
                    }`}
                  >
                    <MapPin
                      size={14}
                      className="shrink-0 text-red-400"
                    />

                    <span className="min-w-0 flex-1">
                      {item.name}
                    </span>

                    {isSelected && (
                      <CheckCircle2
                        size={15}
                        className="shrink-0 text-emerald-400"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Selected realm's fictional warning */}
            {destination && (
              <div className="mt-3 rounded-lg border border-red-900/30 bg-red-950/20 p-2.5">
                <p className="text-[11px] leading-relaxed text-gray-400">
                  {destination.message}
                </p>
              </div>
            )}

            {/* Disclaimer */}
            <div className="mt-3 flex items-start gap-2 border-t border-[#51303d] pt-3">
              <Ghost
                size={14}
                className="shrink-0 text-gray-500"
              />

              <p className="text-[10px] leading-relaxed text-gray-500">
                Delivery is purely fictional. Our couriers
                are not recognized in this dimension.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeliveryDestination;

