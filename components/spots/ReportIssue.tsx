'use client'

import { useState } from 'react'
import { RiAlertLine } from 'react-icons/ri'
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import { submitReport } from '@/app/actions/reports'
import { toast } from 'sonner'
import { Spot } from '@/lib/types'

interface ReportIssueProps {
  spot?: Spot
  trigger?: React.ReactNode
}

export function ReportIssue({ spot, trigger }: ReportIssueProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [issueType, setIssueType] = useState<string>('')
  
  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(event.currentTarget)
    const data = {
      spotId: spot?.id,
      spotName: spot?.name,
      issueType: (issueType || 'other') as any,
      description: formData.get('description') as string,
      email: formData.get('email') as string || undefined,
    }
    
    if (!data.description || !data.issueType) {
      toast.error('Please fill in all required fields')
      setIsSubmitting(false)
      return
    }
    
    const result = await submitReport(data)
    
    if (result.success) {
      toast.success('Thank you! We\'ll look into this issue.')
      setIsOpen(false)
      setIssueType('')
    } else {
      toast.error('Something went wrong. Please try again.')
    }
    
    setIsSubmitting(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-destructive gap-2">
            <RiAlertLine className="w-4 h-4" />
            <span>Report an issue</span>
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Report an issue</DialogTitle>
          <DialogDescription>
            {spot 
              ? `Help us keep the information for ${spot.name} accurate.`
              : 'Help us improve Outsy by reporting an issue.'}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="issueType">What&apos;s wrong?</Label>
            <Select onValueChange={setIssueType} required>
              <SelectTrigger>
                <SelectValue placeholder="Select issue type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="incorrect_info">Incorrect information</SelectItem>
                <SelectItem value="closed_permanently">Closed permanently</SelectItem>
                <SelectItem value="wrong_location">Wrong location</SelectItem>
                <SelectItem value="bad_link">Broken link</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Tell us more</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Provide as much detail as possible..." 
              required
              className="min-h-[100px]"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Your email (optional)</Label>
            <Input 
              id="email" 
              name="email" 
              type="email" 
              placeholder="So we can follow up if needed" 
            />
          </div>
          
          <DialogFooter className="sm:justify-end">
            <Button 
              type="button" 
              variant="secondary" 
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Report'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
