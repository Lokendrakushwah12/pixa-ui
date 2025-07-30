'use client';

import { useMobile } from '@/hooks/useMobile';
import { Drawer } from 'vaul';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';

interface ResponsiveDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    description?: string;
    trigger: React.ReactNode;
    children: React.ReactNode;
}

export function ResponsiveDialog({
    open,
    onOpenChange,
    title,
    description,
    trigger,
    children,
}: ResponsiveDialogProps) {
    const isMobile = useMobile();

    if (isMobile) {
        return (
            <Drawer.Root open={open} onOpenChange={onOpenChange}>
                <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
                <Drawer.Portal>
                    <Drawer.Overlay className="fixed inset-0 bg-black/40" />
                    <Drawer.Content
                        data-vaul-custom-container="true"
                        data-vaul-drawer
                        data-vaul-drawer-direction="bottom"
                        aria-describedby={undefined}
                        className="bg-muted dark:bg-black border h-fit p-1 m-2 rounded-xl fixed bottom-0 left-0 right-0 outline-none"
                    >
                        <Drawer.Title className="text-center font-medium p-1.5">{title}</Drawer.Title>
                        {description && (
                            <Drawer.Description className="text-sm text-muted-foreground text-center pb-2">{description}</Drawer.Description>
                        )}
                        <div className="space-y-6 bg-background p-3 rounded-lg">{children}</div>
                    </Drawer.Content>
                </Drawer.Portal>
            </Drawer.Root>
        );
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent aria-describedby={undefined} className="bg-muted rounded-xl gap-0 h-fit dark:bg-black p-1">
                <DialogHeader className="p-2">
                    <DialogTitle className="text-center font-medium">{title}</DialogTitle>
                    {description && (
                        <DialogDescription className="text-sm text-muted-foreground text-center pb-2">{description}</DialogDescription>
                    )}
                </DialogHeader>
                <div className="space-y-6 bg-background p-3 rounded-lg">{children}</div>
            </DialogContent>
        </Dialog>
    );
}
