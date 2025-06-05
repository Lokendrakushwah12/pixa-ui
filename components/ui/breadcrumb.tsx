import Link from "next/link";
import { ChevronRight } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export const Breadcrumb = ({ items }: BreadcrumbProps) => {
  return (
    <nav className="flex items-center space-x-1 text-sm text-muted-foreground mb-6">
      {items.map((item, index) => (
        <div key={index} className="flex items-center">
          {index > 0 && (
            <ChevronRight size={16} className="text-muted-foreground/60" />
          )}
          {item.href ? (
            <Link 
              href={item.href} 
              className="hover:text-foreground transition-colors capitalize"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-foreground capitalize">{item.label}</span>
          )}
        </div>
      ))}
    </nav>
  );
};