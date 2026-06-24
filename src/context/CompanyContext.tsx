import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'
import { SEED_COMPANIES } from '@/data/seedCompanies'

const STORAGE_KEY = 'selected-company'

export interface SelectedCompany {
  companyId: number
  companyName: string
  logoUrl: string
}

interface CompanyContextValue {
  selected: SelectedCompany | null
  setSelected: (company: SelectedCompany) => void
  clearSelected: () => void
}

const CompanyContext = createContext<CompanyContextValue | null>(null)

function readFromStorage(): SelectedCompany | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as SelectedCompany
    // Validate against seed
    const exists = SEED_COMPANIES.find((c) => c.company_id === parsed.companyId)
    return exists ? parsed : null
  } catch {
    return null
  }
}

function writeToStorage(company: SelectedCompany) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(company))
}

function clearStorage() {
  localStorage.removeItem(STORAGE_KEY)
}

export function CompanyProvider({ children }: { children: ReactNode }) {
  const [selected, setSelectedState] = useState<SelectedCompany | null>(readFromStorage)

  const setSelected = useCallback((company: SelectedCompany) => {
    writeToStorage(company)
    setSelectedState(company)
  }, [])

  const clearSelected = useCallback(() => {
    clearStorage()
    setSelectedState(null)
  }, [])

  return (
    <CompanyContext.Provider value={{ selected, setSelected, clearSelected }}>
      {children}
    </CompanyContext.Provider>
  )
}

export function useCompany() {
  const ctx = useContext(CompanyContext)
  if (!ctx) throw new Error('useCompany must be used inside <CompanyProvider>')
  return ctx
}
