"use client";
// app/categories/page.jsx
import Header from "@/components/Header";
import CategoryCard from "@/components/CategoryCard";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const res = await fetch(
          "http://localhost:8000/api/services/categories/"
        );
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("API error:", error);
      }
    }

    loadCategories();
  }, []);

  return (
    <div className="min-h-screen bg-light-bg">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Title */}
        <div className="mb-10 text-center md:text-left">
          <h1 className="font-heading font-bold text-4xl sm:text-5xl text-foreground mb-3">
            All Service Categories
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl">
            Browse and select from our wide range of professional home services
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
          {categories.map((category) => {
            return (
              <div
                key={category.id}
                onClick={() => router.push(`/categories/${category.id}`)}
                className="group cursor-pointer"
              >
                <p>{category.is_active}</p>
                <CategoryCard
                  icon={category.icon}
                  title={category.name}
                  description={category.description}
                />
                {/* <p className="text-center mt-3 text-sm text-muted-foreground font-medium">
                  {category.serviceCount} services available
                </p> */}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
