import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Eye,
  Phone,
  MapPin,
  Package,
  CheckCircle,
  Clock,
  Truck,
} from "lucide-react";

const OrderCard = ({ order, onUpdateStatus, hideActions = false }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-700 border-orange-200";
      case "packing":
        return "bg-blue-100 text-blue-700 border-blue-200";
      case "out-for-delivery":
        return "bg-purple-100 text-purple-700 border-purple-200";
      case "completed":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="h-3 w-3" />;
      case "packing":
        return <Package className="h-3 w-3" />;
      case "out-for-delivery":
        return <Truck className="h-3 w-3" />;
      case "completed":
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  const getStatusDisplayName = (status) => {
    switch (status) {
      case "out-for-delivery":
        return "Out for Delivery";
      default:
        return status;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-400 w-full">
      <CardHeader className="pb-3 px-4 pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-2">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-base sm:text-lg font-semibold text-gray-800 truncate">
              {order.id}
            </CardTitle>
            <p className="text-sm text-gray-600 mt-1 truncate">
              {order.customerName}
            </p>
          </div>
          <Badge
            className={`${getStatusColor(
              order.status
            )} flex items-center gap-1 text-xs whitespace-nowrap`}
          >
            {getStatusIcon(order.status)}
            <span className="hidden sm:inline">
              {getStatusDisplayName(order.status)}
            </span>
            <span className="sm:hidden">
              {status === "out-for-delivery"
                ? "Out"
                : getStatusDisplayName(order.status)}
            </span>
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="px-4 pb-4">
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total</span>
            <span className="font-semibold text-green-600 text-base">
              ${order.total.toFixed(2)}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Time</span>
            <span className="text-xs sm:text-sm text-right">
              {order.orderTime}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Items</span>
            <span className="text-sm">{order.items.length}</span>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full h-10 touch-manipulation"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-lg">{order.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Customer Info
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium min-w-0">
                          Name:
                        </span>
                        <span className="text-sm truncate">
                          {order.customerName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">{order.customerPhone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span className="text-sm leading-relaxed">
                          {order.deliveryAddress}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">
                      Order Items
                    </h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div className="min-w-0 flex-1 mr-2">
                            <span className="text-sm font-medium block truncate">
                              {item.name}
                            </span>
                            <p className="text-xs text-gray-600">
                              {item.quantity}
                            </p>
                          </div>
                          <span className="text-sm font-semibold flex-shrink-0">
                            ${item.price.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-green-600 text-lg">
                        ${order.total.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {!hideActions && (
              <>
                {order.status === "pending" && (
                  <Button
                    size="sm"
                    className="w-full h-10 bg-blue-500 hover:bg-blue-600 touch-manipulation"
                    onClick={() => onUpdateStatus(order.id, "packing")}
                  >
                    Start Packing
                  </Button>
                )}
                {order.status === "packing" && (
                  <Button
                    size="sm"
                    className="w-full h-10 bg-purple-500 hover:bg-purple-600 touch-manipulation"
                    onClick={() => onUpdateStatus(order.id, "out-for-delivery")}
                  >
                    Send for Delivery
                  </Button>
                )}
                {order.status === "out-for-delivery" && (
                  <Button
                    size="sm"
                    className="w-full h-10 bg-green-500 hover:bg-green-600 touch-manipulation"
                    onClick={() => onUpdateStatus(order.id, "completed")}
                  >
                    Mark Delivered
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
