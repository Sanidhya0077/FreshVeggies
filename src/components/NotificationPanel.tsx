
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bell, Package, AlertCircle, CheckCircle } from "lucide-react";

const NotificationPanel = ({ notifications, onClose }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new-order':
        return <Bell className="h-4 w-4 text-green-600" />;
      case 'order-update':
        return <Package className="h-4 w-4 text-blue-600" />;
      case 'alert':
        return <AlertCircle className="h-4 w-4 text-orange-600" />;
      default:
        return <CheckCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="absolute top-12 right-0 w-80 z-50">
      <Card className="border-2 border-green-200 shadow-lg">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span className="text-lg">Notifications</span>
            <Badge variant="secondary">{notifications.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="max-h-80 overflow-y-auto">
          {notifications.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No new notifications</p>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-semibold text-gray-800">
                        {notification.title}
                      </h4>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {notification.time}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationPanel;
