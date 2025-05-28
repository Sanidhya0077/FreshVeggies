
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Eye, Phone, MapPin, Package, CheckCircle, Clock } from "lucide-react";

const OrderCard = ({ order, onUpdateStatus, hideActions = false }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-3 w-3" />;
      case 'preparing':
        return <Package className="h-3 w-3" />;
      case 'completed':
        return <CheckCircle className="h-3 w-3" />;
      default:
        return null;
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-green-400">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-semibold text-gray-800">{order.id}</CardTitle>
            <p className="text-sm text-gray-600 mt-1">{order.customerName}</p>
          </div>
          <Badge className={`${getStatusColor(order.status)} flex items-center gap-1`}>
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Total Amount</span>
            <span className="font-semibold text-green-600">${order.total.toFixed(2)}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Order Time</span>
            <span className="text-sm">{order.orderTime}</span>
          </div>
          
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">Items</span>
            <span className="text-sm">{order.items.length} item(s)</span>
          </div>

          <div className="flex gap-2 mt-4">
            <Dialog open={showDetails} onOpenChange={setShowDetails}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Details
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Order Details - {order.id}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="border-b pb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Customer Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Name:</span>
                        <span className="text-sm">{order.customerName}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span className="text-sm">{order.customerPhone}</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5" />
                        <span className="text-sm">{order.deliveryAddress}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
                          <div>
                            <span className="text-sm font-medium">{item.name}</span>
                            <p className="text-xs text-gray-600">{item.quantity}</p>
                          </div>
                          <span className="text-sm font-semibold">${item.price.toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between items-center pt-3 border-t border-gray-200 mt-3">
                      <span className="font-semibold">Total:</span>
                      <span className="font-bold text-green-600">${order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            {!hideActions && (
              <>
                {order.status === 'pending' && (
                  <Button 
                    size="sm" 
                    className="flex-1 bg-blue-500 hover:bg-blue-600"
                    onClick={() => onUpdateStatus(order.id, 'preparing')}
                  >
                    Start Preparing
                  </Button>
                )}
                {order.status === 'preparing' && (
                  <Button 
                    size="sm" 
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={() => onUpdateStatus(order.id, 'completed')}
                  >
                    Mark Complete
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
