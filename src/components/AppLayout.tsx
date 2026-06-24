import { Outlet, useLocation, Link } from 'react-router-dom'
import { ChevronRight, Home } from 'lucide-react'
import { AppSidebar } from '@/components/AppSidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { useCompany } from '@/context/CompanyContext'

const SECTION_LABELS: Record<string, string> = {
  intelligence: 'Company Intelligence',
  skills: 'Skill Intelligence',
}

export function AppLayout() {
  const location = useLocation()
  const { selected } = useCompany()

  const segments = location.pathname.replace(/^\/company\/?/, '').split('/').filter(Boolean)
  const sectionLabel = segments[0] ? SECTION_LABELS[segments[0]] ?? segments[0] : ''

  return (
    <SidebarProvider>
      <AppSidebar />
      <div className="flex flex-1 flex-col min-w-0">
        {/* Top header bar */}
        <header className="sticky top-0 z-30 flex h-12 items-center gap-3 border-b bg-background px-4">
          <SidebarTrigger />
          {/* Breadcrumbs */}
          <nav className="flex items-center gap-1 text-sm text-muted-foreground overflow-hidden">
            <Link to="/" className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0">
              <Home className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Companies</span>
            </Link>
            {selected && (
              <>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate max-w-[120px] sm:max-w-[200px] text-foreground font-medium">
                  {selected.companyName}
                </span>
              </>
            )}
            {sectionLabel && (
              <>
                <ChevronRight className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate text-muted-foreground">{sectionLabel}</span>
              </>
            )}
          </nav>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}
