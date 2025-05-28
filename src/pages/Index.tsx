
import { useState, useEffect } from "react";
import { Bell, Package, TrendingUp, Users, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OrderCard from "@/components/OrderCard";
import NotificationPanel from "@/components/NotificationPanel";
import StatsCard from "@/components/StatsCard";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerPhone: "+1 234-567-8900",
    items: [
      { name: "Tomatoes", quantity: "2 kg", price: 8.00 },
      { name: "Carrots", quantity: "1 kg", price: 4.50 },
      { name: "Onions", quantity: "1.5 kg", price: 3.75 }
    ],
    total: 16.25,
    status: "pending",
    orderTime: "2024-05-28 09:30 AM",
    deliveryAddress: "123 Green Street, Garden City"
  },
  {
    id: "ORD-002",
    customerName: "Sarah Wilson",
    customerPhone: "+1 234-567-8901",
    items: [
      { name: "Lettuce", quantity: "3 heads", price: 6.00 },
      { name: "Bell Peppers", quantity: "500g", price: 5.50 }
    ],
    total: 11.50,
    status: "preparing",
    orderTime: "2024-05-28 10:15 AM",
    deliveryAddress: "456 Fresh Avenue, Vegetable Town"
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerPhone: "+1 234-567-8902",
    items: [
      { name: "Potatoes", quantity: "3 kg", price: 9.00 },
      { name: "Broccoli", quantity: "800g", price: 7.20 },
      { name: "Spinach", quantity: "500g", price: 4.80 }
    ],
    total: 21.00,
    status: "completed",
    orderTime: "2024-05-28 08:45 AM",
    deliveryAddress: "789 Organic Lane, Health District"
  },
  {
    id: "ORD-004",
    customerName: "Emma Davis",
    customerPhone: "+1 234-567-8903",
    items: [
      { name: "Cucumbers", quantity: "1 kg", price: 3.50 },
      { name: "Zucchini", quantity: "800g", price: 4.80 }
    ],
    total: 8.30,
    status: "pending",
    orderTime: "2024-05-28 11:00 AM",
    deliveryAddress: "321 Farm Road, Countryside"
  }
];

const Index = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const { toast } = useToast();

  // Simulate new orders coming in
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance every 10 seconds
        const newOrder = {
          id: `ORD-${String(orders.length + Math.floor(Math.random() * 100)).padStart(3, '0')}`,
          customerName: ["Alex Smith", "Lisa Brown", "David Wilson", "Maria Garcia"][Math.floor(Math.random() * 4)],
          customerPhone: `+1 234-567-${Math.floor(Math.random() * 9000) + 1000}`,
          items: [
            { name: "Mixed Vegetables", quantity: "2 kg", price: 12.00 }
          ],
          total: 12.00,
          status: "pending",
          orderTime: new Date().toLocaleString(),
          deliveryAddress: "New Customer Address"
        };

        setOrders(prev => [newOrder, ...prev]);
        
        const notification = {
          id: Date.now(),
          title: "New Order Received!",
          message: `Order ${newOrder.id} from ${newOrder.customerName}`,
          time: new Date().toLocaleTimeString(),
          type: "new-order"
        };

        setNotifications(prev => [notification, ...prev.slice(0, 4)]);
        
        toast({
          title: "New Order! 🥬",
          description: `${newOrder.customerName} placed an order worth $${newOrder.total}`,
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orders.length, toast]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders(prev => 
      prev.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    toast({
      title: "Order Updated",
      description: `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const pendingOrders = orders.filter(order => order.status === 'pending');
  const preparingOrders = orders.filter(order => order.status === 'preparing');
  const completedOrders = orders.filter(order => order.status === 'completed');
  const totalRevenue = orders.filter(order => order.status === 'completed').reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-green-800 mb-2">Fresh Veggie Dashboard</h1>
            <p className="text-green-600">Manage your vegetable orders efficiently</p>
          </div>
          
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="relative border-green-200 hover:border-green-400 hover:bg-green-50"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5 text-green-600" />
              {notifications.length > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs px-1.5 py-0.5">
                  {notifications.length}
                </Badge>
              )}
            </Button>
            
            {showNotifications && (
              <NotificationPanel 
                notifications={notifications} 
                onClose={() => setShowNotifications(false)}
              />
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Pending Orders"
            value={pendingOrders.length}
            icon={Clock}
            color="orange"
          />
          <StatsCard
            title="Preparing"
            value={preparingOrders.length}
            icon={Package}
            color="blue"
          />
          <StatsCard
            title="Completed Today"
            value={completedOrders.length}
            icon={CheckCircle}
            color="green"
          />
          <StatsCard
            title="Revenue Today"
            value={`$${totalRevenue.toFixed(2)}`}
            icon={TrendingUp}
            color="emerald"
          />
        </div>

        {/* Orders Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Pending Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              <h2 className="text-xl font-semibold text-gray-800">Pending Orders</h2>
              <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                {pendingOrders.length}
              </Badge>
            </div>
            
            {pendingOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))}
            
            {pendingOrders.length === 0 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex items-center justify-center p-8">
                  <p className="text-gray-500">No pending orders</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Preparing Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-5 w-5 text-blue-500" />
              <h2 className="text-xl font-semibold text-gray-800">Preparing</h2>
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                {preparingOrders.length}
              </Badge>
            </div>
            
            {preparingOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
              />
            ))}
            
            {preparingOrders.length === 0 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex items-center justify-center p-8">
                  <p className="text-gray-500">No orders being prepared</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Completed Orders */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <h2 className="text-xl font-semibold text-gray-800">Completed</h2>
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {completedOrders.length}
              </Badge>
            </div>
            
            {completedOrders.map(order => (
              <OrderCard
                key={order.id}
                order={order}
                onUpdateStatus={updateOrderStatus}
                hideActions={true}
              />
            ))}
            
            {completedOrders.length === 0 && (
              <Card className="border-dashed border-2 border-gray-300">
                <CardContent className="flex items-center justify-center p-8">
                  <p className="text-gray-500">No completed orders today</p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
