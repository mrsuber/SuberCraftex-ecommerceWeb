'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Users,
  CheckCircle2,
  Clock,
  AlertCircle,
  Search,
  Eye,
  Filter,
} from 'lucide-react'
import { formatCurrency } from '@/lib/currency'

interface InvestorsManagementClientProps {
  investors: any[]
}

export default function InvestorsManagementClient({ investors: initialInvestors }: InvestorsManagementClientProps) {
  const [investors] = useState(initialInvestors)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  // Filter investors
  const filteredInvestors = investors.filter(investor => {
    const matchesSearch =
      investor.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      investor.investorNumber.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || investor.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Calculate stats
  const stats = {
    total: investors.length,
    pendingVerification: investors.filter(i => i.status === 'pending_verification').length,
    active: investors.filter(i => i.status === 'active').length,
    totalInvested: investors.reduce((sum, i) => sum + parseFloat(i.totalInvested), 0),
    totalProfit: investors.reduce((sum, i) => sum + parseFloat(i.totalProfit), 0),
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; icon: any; label: string }> = {
      pending_verification: { variant: 'secondary', icon: Clock, label: 'Pending' },
      active: { variant: 'default', icon: CheckCircle2, label: 'Active' },
      suspended: { variant: 'destructive', icon: AlertCircle, label: 'Suspended' },
      exited: { variant: 'outline', icon: AlertCircle, label: 'Exited' },
    }

    const config = variants[status] || variants.pending_verification
    const Icon = config.icon

    return (
      <Badge variant={config.variant as any} className="flex items-center gap-1">
        <Icon className="h-3 w-3" />
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Investor Management</h1>
        <p className="text-gray-600 mt-1">
          Manage investor accounts, verify identities, and allocate funds
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Investors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Verification</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pendingVerification}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalInvested)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Profit Distributed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(stats.totalProfit)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name, email, or investor number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending_verification">Pending Verification</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                  <SelectItem value="exited">Exited</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Investors Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Investors ({filteredInvestors.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investor</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Cash Balance</TableHead>
                  <TableHead>Profit Balance</TableHead>
                  <TableHead>Total Invested</TableHead>
                  <TableHead>Investments</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestors.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center text-gray-500 py-8">
                      No investors found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredInvestors.map((investor) => (
                    <TableRow key={investor.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{investor.fullName}</p>
                          <p className="text-sm text-gray-500">{investor.investorNumber}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="text-sm">{investor.email}</p>
                          <p className="text-sm text-gray-500">{investor.phone}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {getStatusBadge(investor.status)}
                          {!investor.isVerified && (
                            <Badge variant="secondary" className="text-xs">
                              Unverified
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(parseFloat(investor.cashBalance))}
                      </TableCell>
                      <TableCell className="font-medium text-green-600">
                        {formatCurrency(parseFloat(investor.profitBalance))}
                      </TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(parseFloat(investor.totalInvested))}
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <p>{investor._count.productAllocations} products</p>
                          <p className="text-gray-500">{investor._count.equipmentAllocations} equipment</p>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">
                        {new Date(investor.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Link href={`/dashboard/investors/${investor.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
