import { Component } from "@/types/components"
import { ChevronRight } from "lucide-react"
import Link from "next/link"

interface ComponentCardProps {
    component: Component
    category: string
}

const ComponentCard = ({ component, category }: ComponentCardProps) => {
    return (
        <Link
            key={component.id}
            href={`/${category}/${component.id}`}
            className="block overflow-hidden border p-[6px] rounded-[14px] bg-muted-foreground/5 hover:bg-muted-foreground/10 transition-all"
        >
            <div className="h-48 rounded-lg bg-background flex items-center justify-center">
                <span className="text-muted-foreground">
                    {component.component && (() => {
                        const ComponentToRender = component.component;
                        return <ComponentToRender />;
                    })()}
                </span>
            </div>
            <div className="p-2 group">
                <h3 className="text-xl font-semibold mb-2">
                </h3>
                <div className="text-sm text-muted-foreground flex justify-start items-center group-hover:translate-x-1 transition-transform">
                    <p className="text-muted-foreground text-sm">
                        {component.name}
                    </p>
                    <ChevronRight strokeWidth={1.5} size={16} className="-mb-0.5" />
                </div>
            </div>
        </Link>
    )
}

export default ComponentCard