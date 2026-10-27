import CategoryItem from '../components/CategoryItem';
import HomePageProducts from '../components/HomePageProducts';

const categories = [
    {href: '/organ', name: 'Organs', imageUrl:"/heart.jpeg" },
    {href: '/forbiddenLibrary', name: 'Forbidden Library', imageUrl:"/book3.jpg" },
    {href: '/weapons', name: 'Weapons', imageUrl:"/weapon2.jpg" },
    {href: '/creepyCollectibles', name: 'Creepy Collectibles', imageUrl:"/doll1.jpg" },
    {href: '/potions', name: 'Potions', imageUrl:"/potion1.jpeg" },
    {href: '/witchesApothecary', name: 'Witches Apothecary', imageUrl:"/book1.jpg" },
    {href: '/The "Questionable" Shelf', name: 'The "Questionable" Shelf', imageUrl:"/weapon1.jpg" },
    {href: '/lost&found', name: 'Lost & Found (Definitely Not Stolen)', imageUrl:"/book1.jpg" },
];


const HomePage = () => {
  
  return (
    <div className="relative min-h-creen text-white overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-7">
            <h1 className="text-center text-5xl font-bold sm:text-6xl text-red-400 mb-4">
                Browse Our Curiosities
            </h1>
            <p className="text-center text-xl text-gray-400 mb-12">
                Some artifacts choose their owner. The rest just scream until someone buys them.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {categories.map((category) => (
                    <CategoryItem
                        category={category}
                        key={category.name}
                    />
                ))}
            </div>

            <HomePageProducts />

        </div>
    </div>

    
);
}

export default HomePage
