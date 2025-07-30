"use client";

import { Button } from "@/components/ui/Button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { AlertTriangle, Bell, CheckCircle, Loader } from "lucide-react";
import { useState } from "react";
import { AnimatedTabs, AnimatedTabsContent, AnimatedTabsList, AnimatedTabsTrigger } from "../../../../packages/ui/src/pixaui/animated-tabs";

interface Notification {
    _id: string;
    channel: string;
    status: string;
    message: { text: string };
    createdAt: string;
    updatedAt: string;
    __v: number;
    response?: { status: number; data: string };
}

interface ProcessedNotification extends Notification {
    metadata: {
        totalPsps?: number;
        totalClients?: number;
        reportDate?: string;
    } | null;
    relevantDate: Date;
    isToday: boolean;
    processedMessage: React.ReactNode;
    style: {
        icon: React.ReactNode;
        bgColor: string;
        borderColor: string;
    };
}

// Helper functions to replace date-fns
const formatTime = (date: Date): string => {
    return date.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });
};

const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
    });
};

const isToday = (date: Date): boolean => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
};

const parseISO = (dateString: string): Date => {
    return new Date(dateString);
};

const isValid = (date: Date): boolean => {
    return !isNaN(date.getTime());
};

// Dummy data for demo
const DUMMY_NOTIFICATIONS: Notification[] = [
    {
        _id: "1",
        channel: "slack",
        status: "sent",
        message: { text: "📈 *Daily Update:* *Number of PSPs:* 42 *Total Number of Clients:* 1,247 *Date:* 2025-06-23 sent automatically." },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        __v: 0,
        response: { status: 200, data: "success" }
    },
    {
        _id: "2",
        channel: "slack",
        status: "sent",
        message: { text: "🔔 Weekly report generated successfully with 38 active PSPs and 1,156 total clients sent manually." },
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
        updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        __v: 0,
        response: { status: 200, data: "success" }
    },
    {
        _id: "3",
        channel: "slack",
        status: "failed",
        message: { text: "❌ Failed to send monthly summary report - connection timeout" },
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
        updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        __v: 0,
        response: { status: 500, data: "error" }
    },
    {
        _id: "4",
        channel: "email",
        status: "sent",
        message: { text: "📧 Client onboarding reminder sent to 15 new prospects" },
        createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
        __v: 0,
        response: { status: 200, data: "success" }
    },
    {
        _id: "5",
        channel: "slack",
        status: "sent",
        message: { text: "📊 Performance metrics updated: 95% uptime, 2.3s avg response time" },
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        __v: 0,
        response: { status: 200, data: "success" }
    }
];

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false);
    const [refreshNotifications, setRefreshNotifications] = useState(false);
    const isAdmin = true; // Mock admin status

    // Extract metadata and validate dates
    const extractMetadata = (text: string) => {
        const pspMatch = text.match(/\*Number of PSPs:\* (\d+)/);
        const clientMatch = text.match(/\*Total Number of Clients:\* ([\d,]+)/);
        const dateMatch = text.match(/\*Date:\* ([\d-]+)/);

        const metadata: any = {};
        if (pspMatch) metadata.totalPsps = parseInt(pspMatch[1]);
        if (clientMatch) metadata.totalClients = parseInt(clientMatch[1].replace(/,/g, ''));

        // Validate report date
        if (dateMatch) {
            const dateStr = dateMatch[1];
            if (/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
                const [month, day] = dateStr.split('-').map(Number);
                if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
                    const testDate = parseISO(dateStr);
                    if (isValid(testDate)) metadata.reportDate = dateStr;
                }
            }
        }

        return Object.keys(metadata).length > 0 ? metadata : null;
    };

    // Always use creation date for sorting and filtering
    const getRelevantDate = (notification: Notification): Date => {
        return parseISO(notification.createdAt);
    };

    // Process message text for display
    const processMessageText = (text: string): React.ReactNode => {
        let processed = text;

        // Handle daily update notifications - show clean version
        if (text.includes('📈 *Daily Update:*')) {
            return '📈 Daily Update';
        }

        // Remove admin-only indicators for non-admins
        if (!isAdmin) {
            processed = processed
                .replace(/sent (manually|automatically)\.?/gi, '') // remove manual/automatic sent indicators
                .trim();
        }

        // Extract and replace Slack links
        const linkRegex = /<(https?:\/\/[^|>]+)\|([^>]+)>/g;
        const links: Array<{ url: string; text: string }> = [];

        processed = processed.replace(linkRegex, (match, url, linkText) => {
            const index = links.length;
            links.push({ url, text: linkText });
            return `__LINK_${index}__`;
        });

        // Clean formatting
        processed = processed
            .replace(/:\w+:/g, '') // emoji codes
            .replace(/\*/g, '') // bold
            .replace(/\n+/g, ' ') // newlines
            .replace(/\s+/g, ' ') // extra spaces
            .trim();

        // Replace link placeholders with JSX
        const parts = processed.split(/(__LINK_\d+__)/);
        return parts.map((part, index) => {
            const linkMatch = part.match(/^__LINK_(\d+)__$/);
            if (linkMatch) {
                const link = links[parseInt(linkMatch[1])];
                return (
                    <a
                        key={index}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline"
                    >
                        {link.text}
                    </a>
                );
            }
            return part;
        });
    };

    // Get notification styling with proper shadcn colors
    const getNotificationStyle = (notification: Notification) => {
        const text = notification.message.text.toLowerCase();

        if (text.includes('manually')) {
            return {
                icon: <CheckCircle className="w-3 h-3 text-blue-600 dark:text-blue-400" />,
                bgColor: 'bg-blue-50 dark:bg-blue-950/20',
                borderColor: 'border-blue-200 dark:border-blue-800/20'
            };
        }

        if (text.includes('daily update')) {
            return {
                icon: <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />,
                bgColor: 'bg-green-50 dark:bg-green-950/20',
                borderColor: 'border-green-200 dark:border-green-800/20'
            };
        }

        if (notification.status === 'sent') {
            return {
                icon: <CheckCircle className="w-3 h-3 text-green-600 dark:text-green-400" />,
                bgColor: 'bg-green-50 dark:bg-green-950/20',
                borderColor: 'border-green-200 dark:border-green-800/20'
            };
        }

        if (notification.response?.status !== 200) {
            return {
                icon: <AlertTriangle className="w-3 h-3 text-destructive" />,
                bgColor: 'bg-destructive/10',
                borderColor: 'border-destructive/20'
            };
        }

        return {
            icon: <Bell className="w-3 h-3 text-muted-foreground" />,
            bgColor: 'bg-muted/50',
            borderColor: 'border-border'
        };
    };

    // Process all notifications once
    const processedNotifications: ProcessedNotification[] = DUMMY_NOTIFICATIONS.map(notification => {
        const metadata = extractMetadata(notification.message.text);
        const relevantDate = getRelevantDate(notification);
        const processedMessage = processMessageText(notification.message.text);
        const style = getNotificationStyle(notification);

        return {
            ...notification,
            metadata,
            relevantDate,
            isToday: isToday(relevantDate),
            processedMessage,
            style
        };
    }).filter(Boolean) as ProcessedNotification[];

    // Sort by createdAt (newest first) and filter by date
    const sortedNotifications = processedNotifications.sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const todayNotifications = sortedNotifications.filter(n => n.isToday);
    const olderNotifications = sortedNotifications.filter(n => !n.isToday);

    // Get unread count
    const unreadCount = todayNotifications.length;

    // Render notification item
    const NotificationItem = ({ notification }: { notification: ProcessedNotification }) => (
        <div className={`p-3 rounded-lg border ${notification.style.bgColor} ${notification.style.borderColor} mb-2`}>
            <div className="flex items-start space-x-2">
                {notification.style.icon}
                <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-foreground line-clamp-2">
                        {notification.processedMessage}
                    </p>
                    <div className="flex items-center space-x-2 mt-1">
                        <p className="text-xs text-muted-foreground">
                            {formatTime(parseISO(notification.createdAt))}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {notification.isToday ? 'Today' : formatDate(notification.relevantDate)}
                        </p>
                    </div>
                    {notification.metadata && (
                        <div className="text-xs text-foreground mt-1">
                            {notification.metadata.totalPsps !== undefined && <span>PSPs: {notification.metadata.totalPsps} </span>}
                            {notification.metadata.totalClients !== undefined && <span>Clients: {notification.metadata.totalClients?.toLocaleString()}</span>}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    // Render notification list
    const NotificationList = ({ notifications, emptyMessage }: {
        notifications: ProcessedNotification[];
        emptyMessage: string;
    }) => {
        if (refreshNotifications) {
            return (
                <div className="py-4 text-center flex items-center justify-center flex-col">
                    <Loader className="animate-spin h-4 w-4" />
                    <p className="text-muted-foreground mt-2 text-xs">Loading...</p>
                </div>
            );
        }
        if (notifications.length === 0) {
            return <p className="text-muted-foreground py-4 text-xs text-center">{emptyMessage}</p>;
        }

        return (
            <div className="space-y-1 max-h-80 overflow-y-auto">
                {notifications.map(notification => (
                    <NotificationItem key={notification._id} notification={notification} />
                ))}
            </div>
        );
    };

    return (
        <div className="p-8 flex justify-center">
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" size="icon" className="relative p-2">
                        <Bell className="h-4 w-4" />
                        {unreadCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-destructive text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                {unreadCount > 9 ? '9+' : unreadCount}
                            </span>
                        )}
                        <span className="sr-only">Notifications</span>
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-96 p-0" align="end">
                    <div className="p-4 border-b border-border">
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-base text-foreground">Notifications</h3>
                            <Button variant="outline" size="sm"
                                disabled={refreshNotifications}
                                onClick={() => {
                                    setRefreshNotifications(true);
                                    setTimeout(() => {
                                        setRefreshNotifications(false);
                                    }, 1000);
                                }}
                            >
                                {
                                    refreshNotifications ? 'Refreshing...' : 'Refresh'
                                }
                            </Button>
                        </div>
                    </div>

                    <AnimatedTabs defaultValue="today" className="w-full p-2">
                        <AnimatedTabsList className="grid w-full grid-cols-2 bg-muted p-1 rounded-xl">
                            <AnimatedTabsTrigger value="today" className="text-xs text-center">Today ({todayNotifications.length})</AnimatedTabsTrigger>
                            <AnimatedTabsTrigger value="older" className="text-xs text-center">Older ({olderNotifications.length})</AnimatedTabsTrigger>
                        </AnimatedTabsList>

                        <div className="p-2">
                            <AnimatedTabsContent value="today" className="mt-0">
                                <NotificationList
                                    notifications={todayNotifications}
                                    emptyMessage="No notifications for today"
                                />
                            </AnimatedTabsContent>

                            <AnimatedTabsContent value="older" className="mt-0">
                                <NotificationList
                                    notifications={olderNotifications}
                                    emptyMessage="No older notifications"
                                />
                            </AnimatedTabsContent>
                        </div>
                    </AnimatedTabs>
                </PopoverContent>
            </Popover>
        </div>
    );
}