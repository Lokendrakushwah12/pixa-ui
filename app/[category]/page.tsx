import { Breadcrumb } from "@/components/ui/breadcrumb";
import ComponentCard from "@/components/ui/component-card";
import { getCategoryById } from "@/config/components";
import { Component } from "@/types/components";
import { notFound } from "next/navigation";

interface CategoryPageProps {
  params: {
    category: string;
  };
}

const CategoryPage = ({ params }: CategoryPageProps) => {
  const { category } = params;
  const categoryData = getCategoryById(category);

  console.log("data", categoryData)

  if (!categoryData) {
    notFound();
  }

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: categoryData.name },
  ];

  return (
    <div className="max-w-screen-lg mx-auto sm:px-0 px-4 py-8">
      <Breadcrumb items={breadcrumbItems} />
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">{categoryData.name}</h1>
        <p className="text-muted-foreground text-lg">{categoryData.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryData.components.map((component: Component) => (
          <ComponentCard
            key={component.id}
            component={component}
            category={category}
          />
        ))}
      </div>
    </div >
  );
};

export default CategoryPage;