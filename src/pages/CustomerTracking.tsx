import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, CheckCircle, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CustomerTracking = () => {
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [currentStatus, setCurrentStatus] = useState("confirmed");

  useEffect(() => {
    const savedOrder = localStorage.getItem("currentOrder");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    }
  }, []);

  useEffect(() => {
    if (!order) return;

    const statusProgression = [
      "confirmed",
      "preparing",
      "packing",
      "out-for-delivery",
      "delivered",
    ];
    let currentIndex = statusProgression.indexOf(currentStatus);

    const interval = setInterval(() => {
      if (currentIndex < statusProgression.length - 1) {
        currentIndex++;
        setCurrentStatus(statusProgression[currentIndex]);

        // Update order in localStorage
        const updatedOrder = {
          ...order,
          status: statusProgression[currentIndex],
        };
        setOrder(updatedOrder);
        localStorage.setItem("currentOrder", JSON.stringify(updatedOrder));
      } else {
        clearInterval(interval);
      }
    }, 10000); // Progress every 10 seconds for demo

    return () => clearInterval(interval);
  }, [order, currentStatus]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return <CheckCircle className="h-5 w-5" />;

      case "packing":
        return <Package className="h-5 w-5" />;
      case "out-for-delivery":
        return <Package className="h-5 w-5" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Package className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string, currentStatus: string) => {
    const statusOrder = [
      "confirmed",
      "packing",
      "out-for-delivery",
      "delivered",
    ];
    const currentIndex = statusOrder.indexOf(currentStatus);
    const statusIndex = statusOrder.indexOf(status);

    if (statusIndex <= currentIndex) {
      return "bg-green-500 text-white";
    }
    return "bg-gray-200 text-gray-600";
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "confirmed":
        return "Order Confirmed";

      case "packing":
        return "Packing";
      case "out-for-delivery":
        return "Out for Delivery";
      case "delivered":
        return "Delivered";
      default:
        return status;
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                No active orders
              </h2>
              <p className="text-gray-500 mb-6">
                Place an order to track it here!
              </p>
              <Button
                onClick={() => navigate("/customer-products")}
                className="bg-green-500 hover:bg-green-600"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const statusSteps = [
    { key: "confirmed", label: "Order Confirmed", time: "2:30 PM" },
    {
      key: "packing",
      label: "Packing",
      time: currentStatus !== "confirmed" ? "2:45 PM" : "Pending",
    },
    {
      key: "out-for-delivery",
      label: "Out for Delivery",
      time: ["out-for-delivery", "delivered"].includes(currentStatus)
        ? "3:15 PM"
        : "Pending",
    },
    {
      key: "delivered",
      label: "Delivered",
      time: currentStatus === "delivered" ? "3:45 PM" : "Pending",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              Track Your Order
            </h1>
          </div>
          <Button
            onClick={() => navigate("/customer-products")}
            variant="outline"
          >
            Order Again
          </Button>
        </div>

        {/* Order Details */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <CardTitle>Order #{order.id}</CardTitle>
              <Badge className={getStatusColor(currentStatus, currentStatus)}>
                {getStatusLabel(currentStatus)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold mb-2">Order Items:</h3>
                <div className="space-y-1">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>
                        {item.name} x {item.quantity}
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Delivery Address:</h3>
                <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                <p className="text-lg font-bold text-green-600 mt-2">
                  Total: ${order.total.toFixed(2)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Order Status Timeline */}
        <Card>
          <CardHeader>
            <CardTitle>Order Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="flex items-center gap-4">
                  <div
                    className={`flex items-center justify-center w-10 h-10 rounded-full ${getStatusColor(
                      step.key,
                      currentStatus
                    )}`}
                  >
                    {getStatusIcon(step.key)}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                      <span className="font-medium">{step.label}</span>
                      <span className="text-sm text-gray-500">{step.time}</span>
                    </div>
                    {step.key === currentStatus &&
                      currentStatus !== "delivered" && (
                        <p className="text-sm text-blue-600 mt-1">
                          In progress...
                        </p>
                      )}
                  </div>
                </div>
              ))}
            </div>

            {currentStatus === "delivered" && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span className="font-semibold">
                    Order Delivered Successfully!
                  </span>
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Thank you for choosing us! We hope you enjoy your fresh
                  produce.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerTracking;
