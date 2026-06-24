import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 text-center">
      <div className="rounded-full bg-muted p-6">
        <Home className="h-10 w-10 text-muted-foreground" />
      </div>
      <h1 className="font-heading text-3xl font-bold text-foreground">404 — Page Not Found</h1>
      <p className="text-sm text-muted-foreground max-w-sm">
        The page you're looking for doesn't exist. It may have been moved or the URL is incorrect.
      </p>
      <Button asChild>
        <Link to="/">Back to Companies</Link>
      </Button>
    </div>
  )
}
