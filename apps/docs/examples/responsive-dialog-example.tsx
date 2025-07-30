"use client";
import { Loader } from 'lucide-react'
import React from 'react'
import { ResponsiveDialog } from '../components/sections/dia'
import { Button } from '../components/ui/Button'

const DialogExample = () => {
    const [open, setOpen] = React.useState(false)
    const [isLoading, setIsLoading] = React.useState(false)

    const onOpenChange = (open: boolean) => {
        setOpen(open)
        if (!open) {
            setIsLoading(false)
        }
    }

    const handleCancel = async () => {
        setIsLoading(true)
        await new Promise((resolve) => setTimeout(resolve, 2000))
        setIsLoading(false)
        onOpenChange(false)
    }

    return (
        <ResponsiveDialog
            open={open}
            onOpenChange={onOpenChange}
            title="Cancel Subscription"
            trigger={<Button variant="destructive">Cancel Subscription</Button>}
        >
            <div className="space-y-3 text-muted-foreground text-sm">
                <p>Are you sure you want to cancel your subscription?</p>
                <p>
                    If you cancel now, you'll lose access immediately. You can always start a new
                    subscription later, but you won't get another free trial.
                </p>
            </div>
            <div className="flex flex-col-reverse md:flex-row justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
                    Keep Subscription
                </Button>
                <Button variant="destructive" onClick={handleCancel} disabled={isLoading}>
                    {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                    Cancel Subscription
                </Button>
            </div>
        </ResponsiveDialog>
    )
}

export default DialogExample