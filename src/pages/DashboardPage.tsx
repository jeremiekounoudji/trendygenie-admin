import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardHeader, Button, Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Spinner } from '@heroui/react';
import SummaryCard from '../components/common/SummaryCard';
import { useUsers } from '../hooks/useUsers';
import { useCompanies } from '../hooks/useCompanies';
import { useBusinesses } from '../hooks/useBusinesses';
import { useServices } from '../hooks/useServices';
import { useTransactions } from '../hooks/useTransactions';
import { ROUTES } from '../constants/routes';
import { COMPANY_STATUS_COLORS, BUSINESS_STATUS_COLORS, TRANSACTION_STATUS_COLORS } from '../constants/status';

const UsersIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const CompaniesIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const BusinessesIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
  </svg>
);

const ServicesIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const TransactionsIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
  </svg>
);


export default function DashboardPage() {
  const navigate = useNavigate();

  const { stats: userStats, statsLoading: userStatsLoading } = useUsers();
  const { stats: companyStats, statsLoading: companyStatsLoading, companies, loading: companiesLoading } = useCompanies();
  const { stats: businessStats, statsLoading: businessStatsLoading, businesses, loading: businessesLoading } = useBusinesses();
  const { stats: serviceStats, statsLoading: serviceStatsLoading } = useServices();
  const { stats: transactionStats, statsLoading: transactionStatsLoading, transactions, loading: transactionsLoading } = useTransactions();

  // Filter pending companies and businesses
  const pendingCompanies = companies.filter(c => c.status === 'pending').slice(0, 10);
  const pendingBusinesses = businesses.filter(b => b.status === 'pending').slice(0, 10);
  const recentTransactions = transactions.slice(0, 10);

  const formatDate = (date: string) => new Date(date).toLocaleDateString();
  const formatCurrency = (amount: number, currency: string = 'NGN') => 
    new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amount);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-default-900 mb-2">Dashboard</h1>
        <p className="text-default-500">Overview of platform metrics</p>
      </div>

      {/* Summary Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <SummaryCard title="Total Users" value={userStats?.total ?? null} icon={<UsersIcon />} loading={userStatsLoading} onClick={() => navigate(ROUTES.USERS)} color="primary" />
        <SummaryCard title="Total Companies" value={companyStats?.total ?? null} icon={<CompaniesIcon />} loading={companyStatsLoading} onClick={() => navigate(ROUTES.COMPANIES)} color="secondary" />
        <SummaryCard title="Total Businesses" value={businessStats?.total ?? null} icon={<BusinessesIcon />} loading={businessStatsLoading} onClick={() => navigate(ROUTES.BUSINESSES)} color="success" />
        <SummaryCard title="Total Services" value={serviceStats?.total ?? null} icon={<ServicesIcon />} loading={serviceStatsLoading} onClick={() => navigate(ROUTES.SERVICES)} color="warning" />
        <SummaryCard title="Total Transactions" value={transactionStats?.total ?? null} icon={<TransactionsIcon />} loading={transactionStatsLoading} onClick={() => navigate(ROUTES.TRANSACTIONS)} color="danger" />
      </div>

      {/* Two Column Grid: Transactions & Pending Companies */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Transactions */}
        <Card className="min-h-[350px]">
          <CardHeader className="flex justify-between items-center px-6 py-4 border-b border-default-100">
            <h2 className="text-lg font-semibold text-default-800">Recent Transactions</h2>
            <Button size="sm" variant="flat" color="primary" onPress={() => navigate(ROUTES.TRANSACTIONS)}>See More</Button>
          </CardHeader>
          <CardBody className="p-0">
            {transactionsLoading ? (
              <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : recentTransactions.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-default-400">
                <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p>No transactions yet</p>
              </div>
            ) : (
              <Table aria-label="Recent transactions" removeWrapper>
                <TableHeader>
                  <TableColumn>ID</TableColumn>
                  <TableColumn>Amount</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Date</TableColumn>
                </TableHeader>
                <TableBody>
                  {recentTransactions.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-mono text-xs">#{t.id.slice(-6)}</TableCell>
                      <TableCell>{formatCurrency(t.amount, t.currency)}</TableCell>
                      <TableCell>
                        <Chip size="sm" color={TRANSACTION_STATUS_COLORS[t.status] as 'default'} variant="flat">{t.status}</Chip>
                      </TableCell>
                      <TableCell className="text-xs">{formatDate(t.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* Pending Companies */}
        <Card className="min-h-[350px]">
          <CardHeader className="flex justify-between items-center px-6 py-4 border-b border-default-100">
            <h2 className="text-lg font-semibold text-default-800">Pending Companies</h2>
            <Button size="sm" variant="flat" color="primary" onPress={() => navigate(ROUTES.COMPANIES)}>See More</Button>
          </CardHeader>
          <CardBody className="p-0">
            {companiesLoading ? (
              <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : pendingCompanies.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 text-default-400">
                <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p>No pending companies</p>
              </div>
            ) : (
              <Table aria-label="Pending companies" removeWrapper>
                <TableHeader>
                  <TableColumn>Name</TableColumn>
                  <TableColumn>Owner</TableColumn>
                  <TableColumn>Status</TableColumn>
                  <TableColumn>Date</TableColumn>
                </TableHeader>
                <TableBody>
                  {pendingCompanies.map((c) => (
                    <TableRow key={c.id}>
                      <TableCell className="font-medium">{c.name}</TableCell>
                      <TableCell className="text-xs">{c.owner?.full_name || '—'}</TableCell>
                      <TableCell>
                        <Chip size="sm" color={COMPANY_STATUS_COLORS[c.status] as 'default'} variant="flat">{c.status}</Chip>
                      </TableCell>
                      <TableCell className="text-xs">{formatDate(c.created_at)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>

      {/* Full Width: Pending Businesses */}
      <Card className="min-h-[350px]">
        <CardHeader className="flex justify-between items-center px-6 py-4 border-b border-default-100">
          <h2 className="text-lg font-semibold text-default-800">Pending Businesses</h2>
          <Button size="sm" variant="flat" color="primary" onPress={() => navigate(ROUTES.BUSINESSES)}>See More</Button>
        </CardHeader>
        <CardBody className="p-0">
          {businessesLoading ? (
            <div className="flex justify-center items-center h-64"><Spinner /></div>
          ) : pendingBusinesses.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-default-400">
              <svg className="w-12 h-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              <p>No pending businesses</p>
            </div>
          ) : (
            <Table aria-label="Pending businesses" removeWrapper>
              <TableHeader>
                <TableColumn>Name</TableColumn>
                <TableColumn>Company</TableColumn>
                <TableColumn>Email</TableColumn>
                <TableColumn>Status</TableColumn>
                <TableColumn>Created</TableColumn>
              </TableHeader>
              <TableBody>
                {pendingBusinesses.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.name}</TableCell>
                    <TableCell className="text-xs">{b.company?.name || '—'}</TableCell>
                    <TableCell className="text-xs">{b.contact_email}</TableCell>
                    <TableCell>
                      <Chip size="sm" color={BUSINESS_STATUS_COLORS[b.status] as 'default'} variant="flat">{b.status}</Chip>
                    </TableCell>
                    <TableCell className="text-xs">{formatDate(b.created_at)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardBody>
      </Card>
    </div>
  );
}
