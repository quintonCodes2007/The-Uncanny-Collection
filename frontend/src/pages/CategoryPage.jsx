
import { useParams } from "react-router-dom";
import MarketplaceCatalog from "../components/MarketplaceCatalog";

const CategoryPage = () => {
  const { category: slug } = useParams();

  return <MarketplaceCatalog categorySlug={slug} />;
};

export default CategoryPage;
