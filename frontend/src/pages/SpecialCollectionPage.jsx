import { useLocation } from "react-router-dom";
import MarketplaceCatalog from "../components/MarketplaceCatalog";

const collections = {
  "/deals": {
    collection: "deals",
    title: "The Midnight Sale",
    description:
      "Forbidden bargains and dangerously irresistible discounts. Your wallet has been warned.",
  },

  "/new-arrivals": {
    collection: "new",
    title: "Freshly Summoned Artifacts",
    description:
      "New arrivals from places best left unexplored. Discover what just entered our collection.",
  },

  "/hot-artifacts": {
    collection: "hot",
    title: "Hot Artifacts",
    description:
      "Our most dangerously tempting discoveries. Handle with questionable care.",
  },
};

const SpecialCollectionPage = () => {
  const { pathname } = useLocation();

  const selectedCollection = collections[pathname];

  if (!selectedCollection) return null;

  return (
    <MarketplaceCatalog
      collection={selectedCollection.collection}
      title={selectedCollection.title}
      description={selectedCollection.description}
    />
  );
};

export default SpecialCollectionPage;