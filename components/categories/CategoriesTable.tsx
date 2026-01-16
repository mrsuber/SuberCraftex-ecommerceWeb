"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, Pencil, Trash2, FolderOpen, Folder, ChevronRight } from "lucide-react";
import { CategoryForm } from "./CategoryForm";
import Image from "next/image";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  parentName: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isActive: boolean;
  productCount: number;
  createdAt: string;
}

interface CategoriesTableProps {
  categories: Category[];
}

export function CategoriesTable({ categories }: CategoriesTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");

  // Organize categories into parent/child structure
  const organizedCategories = useMemo(() => {
    const filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(search.toLowerCase()) ||
      cat.slug.toLowerCase().includes(search.toLowerCase())
    );

    // Group by parent
    const parents = filtered.filter(c => !c.parentId);
    const children = filtered.filter(c => c.parentId);

    // Build the organized list: parent followed by its children
    const result: (Category & { isChild?: boolean })[] = [];

    for (const parent of parents) {
      result.push({ ...parent, isChild: false });
      // Add children of this parent
      const parentChildren = children.filter(c => c.parentId === parent.id);
      for (const child of parentChildren) {
        result.push({ ...child, isChild: true });
      }
    }

    // Add orphan children (whose parents are not in the filtered list)
    for (const child of children) {
      if (!result.find(c => c.id === child.id)) {
        result.push({ ...child, isChild: true });
      }
    }

    return result;
  }, [categories, search]);

  // Count parent categories and subcategories
  const parentCount = categories.filter(c => !c.parentId).length;
  const childCount = categories.filter(c => c.parentId).length;

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete category");
      }

      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "Failed to delete category");
    }
  };

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span className="flex items-center gap-1">
          <FolderOpen className="h-4 w-4" />
          {parentCount} parent categories
        </span>
        <span className="flex items-center gap-1">
          <Folder className="h-4 w-4" />
          {childCount} subcategories
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search categories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Category</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Sort Order</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {organizedCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              organizedCategories.map((category) => (
                <TableRow
                  key={category.id}
                  className={category.isChild ? "bg-muted/30" : ""}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {category.isChild && (
                        <ChevronRight className="h-4 w-4 text-muted-foreground ml-4" />
                      )}
                      {category.imageUrl ? (
                        <div className="relative w-8 h-8 rounded-md overflow-hidden border flex-shrink-0">
                          <Image
                            src={category.imageUrl}
                            alt={category.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-md bg-muted flex items-center justify-center flex-shrink-0">
                          {category.isChild ? (
                            <Folder className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <FolderOpen className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      )}
                      <span className={category.isChild ? "text-muted-foreground" : "font-medium"}>
                        {category.name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">{category.slug}</TableCell>
                  <TableCell>
                    {category.parentName ? (
                      <Badge variant="secondary" className="text-xs">
                        Sub of {category.parentName}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs">Parent</Badge>
                    )}
                  </TableCell>
                  <TableCell>{category.productCount}</TableCell>
                  <TableCell>{category.sortOrder}</TableCell>
                  <TableCell>
                    <Badge variant={category.isActive ? "default" : "secondary"}>
                      {category.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <CategoryForm
                          category={{
                            id: category.id,
                            name: category.name,
                            slug: category.slug,
                            description: category.description,
                            parentId: category.parentId,
                            imageUrl: category.imageUrl,
                            sortOrder: category.sortOrder,
                            isActive: category.isActive,
                          }}
                        >
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                        </CategoryForm>
                        <DropdownMenuItem
                          className="text-destructive"
                          onClick={() => handleDelete(category.id, category.name)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
