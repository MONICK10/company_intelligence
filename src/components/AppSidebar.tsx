import { useLocation, useNavigate } from 'react-router-dom'
import { Brain, Zap, LayoutGrid } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar'

const NAV_ITEMS = [
  {
    label: 'Company Intelligence',
    href: '/company/intelligence',
    icon: Brain,
  },
  {
    label: 'Skill Intelligence',
    href: '/company/skills',
    icon: Zap,
  },
]

export function AppSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { collapsed, isMobile, setOpen } = useSidebar()
  const isIconOnly = !isMobile && collapsed

  function handleNav(href: string) {
    if (isMobile) setOpen(false)
    navigate(href)
  }

  return (
    <Sidebar collapsible="icon">
      {/* Logo / branding */}
      <SidebarHeader>
        <div className={`flex items-center gap-2 px-2 py-3 ${isIconOnly ? 'justify-center' : ''}`}>
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Brain className="h-4 w-4" />
          </div>
          {!isIconOnly && (
            <div className="flex flex-col min-w-0">
              <span className="truncate text-xs font-bold font-heading text-foreground leading-none">
                KITS
              </span>
              <span className="truncate text-[10px] text-muted-foreground leading-none mt-0.5">
                Placement Intelligence
              </span>
            </div>
          )}
        </div>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => {
                const isActive =
                  location.pathname === item.href ||
                  location.pathname.startsWith(item.href + '/')
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => handleNav(item.href)}
                      tooltip={isIconOnly ? item.label : undefined}
                      title={isIconOnly ? item.label : undefined}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      {!isIconOnly && (
                        <span className="truncate text-sm">{item.label}</span>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer — All Companies link */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              isActive={location.pathname === '/'}
              onClick={() => handleNav('/')}
              tooltip={isIconOnly ? 'All Companies' : undefined}
              title={isIconOnly ? 'All Companies' : undefined}
            >
              <LayoutGrid className="h-4 w-4 shrink-0" />
              {!isIconOnly && <span className="truncate text-sm">All Companies</span>}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
