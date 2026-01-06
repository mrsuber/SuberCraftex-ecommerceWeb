'use client'

import { useState, useMemo } from 'react'
import { MaterialCard } from './MaterialCard'
import { MaterialDetailModal } from './MaterialDetailModal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react'
import type { Material, ServiceCategory } from '@/types'

interface MaterialGridProps {
  materials: Material[]
  selectedMaterials?: string[] // Array of material IDs
  onSelectMaterial?: (material: Material) => void
  categories?: ServiceCategory[]
  showFilters?: boolean
  columns?: number
}

export function MaterialGrid({
  materials,
  selectedMaterials = [],
  onSelectMaterial,
  categories = [],
  showFilters = true,
  columns = 2, // Changed default to 2 columns
}: MaterialGridProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [stockFilter, setStockFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [detailMaterial, setDetailMaterial] = useState<Material | null>(null)
  const itemsPerPage = 6

  const filteredMaterials = useMemo(() => {
    return materials.filter((material) => {
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matchesSearch =
          material.name.toLowerCase().includes(query) ||
          material.sku.toLowerCase().includes(query) ||
          material.description?.toLowerCase().includes(query)

        if (!matchesSearch) return false
      }

      // Category filter
      if (selectedCategory !== 'all' && material.serviceCategoryId !== selectedCategory) {
        return false
      }

      // Stock filter
      if (stockFilter === 'in-stock' && material.stockQuantity === 0) {
        return false
      }
      if (stockFilter === 'low-stock' && (material.stockQuantity === 0 || material.stockQuantity > 10)) {
        return false
      }
      if (stockFilter === 'out-of-stock' && material.stockQuantity > 0) {
        return false
      }

      return true
    })
  }, [materials, searchQuery, selectedCategory, stockFilter])

  // Pagination
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage)
  const paginatedMaterials = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    return filteredMaterials.slice(startIndex, startIndex + itemsPerPage)
  }, [filteredMaterials, currentPage, itemsPerPage])

  // Reset to page 1 when filters change
  useMemo(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, stockFilter])

  const gridCols = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  }[columns] || 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'

  return (
    <div className="space-y-6">
      {/* Filters */}
      {showFilters && (
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Filter className="w-4 h-4" />
            <span>Filter Materials</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="space-y-2">
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search materials..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            {/* Category Filter */}
            {categories.length > 0 && (
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Stock Filter */}
            <div className="space-y-2">
              <Label>Stock Status</Label>
              <Select value={stockFilter} onValueChange={setStockFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All materials" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All materials</SelectItem>
                  <SelectItem value="in-stock">In stock</SelectItem>
                  <SelectItem value="low-stock">Low stock</SelectItem>
                  <SelectItem value="out-of-stock">Out of stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {/* Results Count */}
      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          Showing {paginatedMaterials.length} of {filteredMaterials.length} materials
          {filteredMaterials.length !== materials.length && ` (${materials.length} total)`}
        </div>
        {totalPages > 1 && (
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
        )}
      </div>

      {/* Materials Grid */}
      {paginatedMaterials.length > 0 ? (
        <div className={`grid gap-6 ${gridCols}`}>
          {paginatedMaterials.map((material) => (
            <MaterialCard
              key={material.id}
              material={material}
              selected={selectedMaterials.includes(material.id)}
              onSelect={onSelectMaterial}
              onViewDetails={() => setDetailMaterial(material)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No materials found matching your criteria</p>
        </div>
      )}

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>

          <div className="flex gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentPage(page)}
                className="min-w-[40px]"
              >
                {page}
              </Button>
            ))}
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}

      {/* Material Detail Modal */}
      {detailMaterial && (
        <MaterialDetailModal
          material={detailMaterial}
          open={!!detailMaterial}
          onClose={() => setDetailMaterial(null)}
          onSelect={onSelectMaterial}
          selected={selectedMaterials.includes(detailMaterial.id)}
        />
      )}
    </div>
  )
}
