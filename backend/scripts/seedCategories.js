
import "dotenv/config";
import mongoose from "mongoose";
import Category from "../models/category.model.js";

const categories = [
  {
    name: "Organs",
    slug: "organs",
    imageUrl: "/heart.jpeg",
    isFeatured: true,
    displayOrder: 1,
  },
  {
    name: "Forbidden Library",
    slug: "forbidden-library",
    imageUrl: "/book3.jpg",
    isFeatured: true,
    displayOrder: 2,
  },
  {
    name: "Weapons",
    slug: "weapons",
    imageUrl: "/weapon2.jpg",
    isFeatured: true,
    displayOrder: 3,
  },
  {
    name: "Creepy Collectibles",
    slug: "creepy-collectibles",
    imageUrl: "/doll1.jpg",
    isFeatured: true,
    displayOrder: 4,
  },
  {
    name: "Potions & Elixirs",
    slug: "potions-elixirs",
    imageUrl: "/potion1.jpeg",
    isFeatured: true,
    displayOrder: 5,
  },
  {
    name: "Occult Tools",
    slug: "occult-tools",
    displayOrder: 6,
  },
  {
    name: "Relics & Artifacts",
    slug: "relics-artifacts",
    displayOrder: 7,
  },
  {
    name: "Curiosities",
    slug: "curiosities",
    displayOrder: 8,
  },
  {
    name: "Cursed Gifts",
    slug: "cursed-gifts",
    displayOrder: 9,
  },
];

const seedCategories = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined");
    }

    await mongoose.connect(process.env.MONGO_URI);

    const operations = categories.map((category) => ({
      updateOne: {
        filter: { slug: category.slug },
        update: {
          $setOnInsert: category,
        },
        upsert: true,
      },
    }));

    const result = await Category.bulkWrite(operations);

    console.log(
      `Inserted ${result.upsertedCount} new categories`
    );

    const savedCategories = await Category.find()
      .sort({ displayOrder: 1 })
      .lean();

    console.table(
      savedCategories.map((category) => ({
        name: category.name,
        slug: category.slug,
        featured: category.isFeatured,
      }))
    );
  } catch (error) {
    console.error("Category seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

seedCategories();
