
import { useState } from "react";
import { MapPin, Ghost, CheckCircle2 } from "lucide-react";

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

  const destination = destinations.find(
    (item) => item.name === selected
  );

  return (
    <section className='space-y-4 rounded-lg border border-gray-700 bg-gray-800 p-4 shadow-sm sm:p-6'>
      {/* Heading */}
      <div className="mb-2 flex items-center gap-2">
        <MapPin size={19} className="shrink-0 text-red-400" />

        <h2 className="text-lg font-semibold text-red-400">
          Choose Your Destination
        </h2>
      </div>

      <p className="mb-4 text-xs leading-relaxed text-gray-400">
        Where shall we send your questionable purchase?
      </p>

      {/* Destination selector */}
      <label
        htmlFor="delivery-destination"
        className="mb-2 block text-xs font-medium text-gray-300"
      >
        Delivery Realm
      </label>

      <select
        id="delivery-destination"
        value={selected}
        onChange={(event) =>
          setSelected(event.target.value)
        }
        className="w-full cursor-pointer rounded-lg border border-[#69404b] bg-gray-800 px-3 py-3 text-sm text-gray-200 outline-none transition-colors focus:border-red-500 focus:ring-1 focus:ring-red-500"
      >
        <option
          value=""
          style={{
            backgroundColor: "#2b1a27",
            color: "#e5e7eb",
          }}
        >
          Select a cursed destination...
        </option>

        {destinations.map((item) => (
          <option
            key={item.name}
            value={item.name}
            style={{
              backgroundColor: "#2b1a27",
              color: "#e5e7eb",
            }}
          >
            {item.name}
          </option>
        ))}
      </select>

      {/* Selected destination */}
      {destination ? (
        <div
          aria-live="polite"
          className="mt-4 rounded-lg border border-[#51303d] bg-gray-800 p-3"
        >
          <div className="mb-2 flex items-center gap-2">
            <CheckCircle2
              size={15}
              className="text-emerald-400"
            />

            <span className="text-xs font-semibold text-red-300">
              Destination Selected
            </span>
          </div>

          <p className="text-sm font-medium text-gray-200">
            {destination.name}
          </p>

          <p className="mt-2 text-xs leading-relaxed text-gray-400">
            {destination.message}
          </p>
        </div>
      ) : (
        <p className="mt-3 text-xs italic text-gray-500">
          No destination selected. Your artifact is currently wandering.
        </p>
      )}

      {/* Disclaimer */}
      <div className="mt-4 flex items-start gap-2 border-t border-[#51303d] pt-3">
        <Ghost
          size={15}
          className="mt-0.5 shrink-0 text-gray-500"
        />

        <p className="text-[11px] leading-relaxed text-gray-500">
          Delivery is purely fictional. Our couriers are
          not legally recognized in this dimension.
        </p>
      </div>
    </section>
  );
};

export default DeliveryDestination;
