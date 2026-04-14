'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, Plus, Package, ChevronDown, X, Filter } from 'lucide-react'
import Image from 'next/image'
import { formatCurrency } from '@/lib/currency'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface Product {
  id: string
  name: string
  sku: string
  price: number
  featured_image?: string
  inventory_count: number
  is_active: boolean
  category_id?: string
}

interface Category {
  id: string
  name: string
  slug: string
  children?: Category[]
}

interface POSProductGridProps {
  onAddToCart: (item: any) => void
  refreshTrigger?: number
}

export default function POSProductGrid({ onAddToCart, refreshTrigger }: POSProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<Category[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedCategoryName, setSelectedCategoryName] = useState<string>('All Categories')

  useEffect(() => {
    loadCategories()
  }, [])

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery])

  useEffect(() => {
    loadProducts()
  }, [refreshTrigger, selectedCategory, debouncedSearch])

  const loadCategories = async () => {
    try {
      const response = await fetch('/api/categories?parentOnly=true&includeChildren=true')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error loading categories:', error)
    }
  }

  const loadProducts = async () => {
    try {
      setLoading(true)
      // Build query string with category filter and search
      const params = new URLSearchParams()
      params.append('isActive', 'true')
      params.append('limit', '1000') // Fetch more products for POS
      if (selectedCategory) {
        params.append('category', selectedCategory)
      }
      if (debouncedSearch.trim()) {
        params.append('search', debouncedSearch.trim())
      }
      params.append('_', Date.now().toString()) // cache-buster

      const response = await fetch(`/api/products?${params.toString()}`, {
        cache: 'no-store'
      })
      if (response.ok) {
        const data = await response.json()
        // API returns { products: [...], total, limit, offset }
        const productList = data.products || []
        setProducts(productList)
        setFilteredProducts(productList)
      }
    } catch (error) {
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySelect = (categoryId: string | null, categoryName: string) => {
    setSelectedCategory(categoryId)
    setSelectedCategoryName(categoryName)
  }

  const handleAddToCart = (product: Product) => {
    onAddToCart({
      productId: product.id,
      name: product.name,
      sku: product.sku,
      price: product.price,
      image: product.featured_image,
      quantity: 1,
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search and Filter Row */}
      <div className="flex gap-2">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 text-lg py-6"
          />
        </div>

        {/* Category Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="px-4 py-6 min-w-[200px] justify-between">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4" />
                <span className="truncate">{selectedCategoryName}</span>
              </div>
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[250px] max-h-[400px] overflow-y-auto bg-white border border-gray-200 shadow-lg">
            <DropdownMenuItem
              onClick={() => handleCategorySelect(null, 'All Categories')}
              className={selectedCategory === null ? 'bg-accent' : ''}
            >
              All Categories
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {categories.map((category) => (
              <div key={category.id}>
                <DropdownMenuItem
                  onClick={() => handleCategorySelect(category.id, category.name)}
                  className={selectedCategory === category.id ? 'bg-accent font-medium' : ''}
                >
                  {category.name}
                </DropdownMenuItem>
                {category.children && category.children.length > 0 && (
                  <div className="ml-4">
                    {category.children.map((subCategory) => (
                      <DropdownMenuItem
                        key={subCategory.id}
                        onClick={() => handleCategorySelect(subCategory.id, `${category.name} > ${subCategory.name}`)}
                        className={selectedCategory === subCategory.id ? 'bg-accent font-medium' : ''}
                      >
                        <span className="text-sm">↳ {subCategory.name}</span>
                      </DropdownMenuItem>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Clear filter button */}
        {selectedCategory && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleCategorySelect(null, 'All Categories')}
            className="py-6"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg border shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="aspect-square relative bg-gray-100">
              {product.featured_image ? (
                <Image
                  src={product.featured_image}
                  alt={product.name}
                  fill
                  className="object-cover rounded-t-lg"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="w-16 h-16 text-gray-300" />
                </div>
              )}
            </div>

            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2 min-h-[3rem]">
                {product.name}
              </h3>
              <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <div className="text-xl font-bold text-gray-900">
                    {formatCurrency(product.price)}
                  </div>
                  <div className={`text-xs ${product.inventory_count > 10 ? 'text-green-600' : product.inventory_count > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                    {product.inventory_count > 0 ? `${product.inventory_count} in stock` : 'Out of stock'}
                  </div>
                </div>

                <Button
                  onClick={() => handleAddToCart(product)}
                  disabled={product.inventory_count === 0}
                  size="sm"
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">
            {searchQuery ? 'No products found matching your search' : 'No products available'}
          </p>
        </div>
      )}
    </div>
  )
}
