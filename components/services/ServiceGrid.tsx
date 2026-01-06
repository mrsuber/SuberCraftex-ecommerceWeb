'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { Service, ServiceCategory } from '@/types'
import { ServiceCard } from './ServiceCard'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Loader2, Search } from 'lucide-react'
import { useDebounce } from '@/hooks/use-debounce'

interface ServiceGridProps {
  initialServices?: Service[]
  initialCategories?: ServiceCategory[]
}

export function ServiceGrid({ initialServices = [], initialCategories = [] }: ServiceGridProps) {
  const [mounted, setMounted] = useState(false)
  const [services, setServices] = useState<Service[]>(initialServices)
  const [categories, setCategories] = useState<ServiceCategory[]>(initialCategories)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState('desc')
  const isInitialMount = useRef(true)

  const debouncedSearch = useDebounce(search, 300)

  // Handle client-side mounting to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/services/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data)
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }

  // Fetch categories on mount if not provided
  useEffect(() => {
    if (initialCategories.length === 0) {
      fetchCategories()
    }
  }, [initialCategories])

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (debouncedSearch) params.append('search', debouncedSearch)
      if (selectedCategory) params.append('category', selectedCategory)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)
      params.append('limit', '50')

      const response = await fetch(`/api/services?${params}`)
      if (response.ok) {
        const data = await response.json()
        setServices(data.services)
      }
    } catch (error) {
      console.error('Error fetching services:', error)
    } finally {
      setLoading(false)
    }
  }, [debouncedSearch, selectedCategory, sortBy, sortOrder])

  // Fetch services when filters change (but not on initial mount if we have initialServices)
  useEffect(() => {
    if (isInitialMount.current && initialServices.length > 0) {
      // Skip initial fetch if we have initialServices
      isInitialMount.current = false
      return
    }
    isInitialMount.current = false
    fetchServices()
  }, [fetchServices, initialServices.length])

  const clearFilters = () => {
    setSearch('')
    setSelectedCategory('')
    setSortBy('createdAt')
    setSortOrder('desc')
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-card rounded-lg border p-4 space-y-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory || undefined} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="All Categories" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Sort */}
          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={(value) => {
              const [field, order] = value.split('-')
              setSortBy(field)
              setSortOrder(order)
            }}
          >
            <SelectTrigger className="w-full lg:w-[200px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="createdAt-desc">Newest First</SelectItem>
              <SelectItem value="createdAt-asc">Oldest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="name-asc">Name: A to Z</SelectItem>
              <SelectItem value="name-desc">Name: Z to A</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(search || selectedCategory) && (
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {loading ? 'Loading...' : `${services.length} service${services.length !== 1 ? 's' : ''} found`}
        </p>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : services.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No services found matching your criteria.</p>
          {(search || selectedCategory) && (
            <Button variant="link" onClick={clearFilters} className="mt-2">
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <ServiceCard key={service.id} service={service} />
          ))}
        </div>
      )}
    </div>
  )
}
