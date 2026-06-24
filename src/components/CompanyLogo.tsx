import { useState } from 'react'

interface CompanyLogoProps {
  name: string
  logoUrl?: string
  domain?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeMap = {
  sm: { outer: 'h-8 w-8', text: 'text-xs' },
  md: { outer: 'h-10 w-10', text: 'text-sm' },
  lg: { outer: 'h-12 w-12', text: 'text-base' },
}

function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase()
}

function buildLogoDevUrl(domain: string): string | null {
  const key = import.meta.env.VITE_LOGO_DEV_PUBLISHABLE_KEY
  if (!key || !domain) return null
  return `https://img.logo.dev/${domain}?token=${key}&size=64&format=png`
}

export function CompanyLogo({ name, logoUrl, domain, size = 'md', className = '' }: CompanyLogoProps) {
  const [imgError, setImgError] = useState(false)
  const [logoDevError, setLogoDevError] = useState(false)
  const { outer, text } = sizeMap[size]

  const logoDevUrl = domain ? buildLogoDevUrl(domain) : null

  // Priority: Logo.dev → seed logo_url → initial circle
  const primarySrc = !logoDevError && logoDevUrl ? logoDevUrl : !imgError && logoUrl ? logoUrl : null

  if (primarySrc) {
    return (
      <div className={`${outer} shrink-0 overflow-hidden rounded ${className}`}>
        <img
          src={primarySrc}
          alt={`${name} logo`}
          className="h-full w-full object-contain"
          onError={() => {
            if (!logoDevError && logoDevUrl && primarySrc === logoDevUrl) {
              setLogoDevError(true)
            } else {
              setImgError(true)
            }
          }}
        />
      </div>
    )
  }

  return (
    <div
      className={`${outer} shrink-0 flex items-center justify-center rounded bg-primary text-primary-foreground font-heading font-bold ${text} ${className}`}
    >
      {getInitial(name)}
    </div>
  )
}
