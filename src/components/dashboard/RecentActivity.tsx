import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface Activity {
  id: string;
  user: string;
  action: string;
  timestamp: string;
  status: "success" | "warning" | "error";
}

const activities: Activity[] = [
  {
    id: "1",
    user: "John Doe",
    action: "Created new product 'Wireless Headphones'",
    timestamp: "2 minutes ago",
    status: "success"
  },
  {
    id: "2", 
    user: "Sarah Smith",
    action: "Updated user profile settings",
    timestamp: "5 minutes ago",
    status: "success"
  },
  {
    id: "3",
    user: "Mike Johnson",
    action: "Failed login attempt",
    timestamp: "10 minutes ago", 
    status: "error"
  },
  {
    id: "4",
    user: "Emma Wilson",
    action: "Placed order #12345",
    timestamp: "15 minutes ago",
    status: "success"
  },
  {
    id: "5",
    user: "David Brown",
    action: "Payment verification pending",
    timestamp: "20 minutes ago",
    status: "warning"
  }
];

export function RecentActivity() {
  const getStatusVariant = (status: Activity["status"]) => {
    switch (status) {
      case "success":
        return "default";
      case "warning":
        return "secondary";
      case "error":
        return "destructive";
      default:
        return "default";
    }
  };

  const getStatusColor = (status: Activity["status"]) => {
    switch (status) {
      case "success":
        return "bg-success";
      case "warning":
        return "bg-warning";
      case "error":
        return "bg-destructive";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-4">
              <div className="relative">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-xs">
                    {activity.user.split(" ").map(n => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border-2 border-white ${getStatusColor(activity.status)}`} />
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  <span className="text-primary">{activity.user}</span> {activity.action}
                </p>
                <p className="text-xs text-muted-foreground">{activity.timestamp}</p>
              </div>
              
              <Badge variant={getStatusVariant(activity.status)} className="text-xs">
                {activity.status}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}