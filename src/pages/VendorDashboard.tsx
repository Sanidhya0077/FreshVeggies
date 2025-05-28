import { useState, useEffect } from "react";
import {
  Bell,
  Package,
  TrendingUp,
  CheckCircle,
  Clock,
  AlertCircle,
  ShoppingCart,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import OrderCard from "@/components/OrderCard";
import NotificationPanel from "@/components/NotificationPanel";
import StatsCard from "@/components/StatsCard";
import ProductModal from "@/components/ProductModal";
import ProductsList from "@/components/ProductsList";

// Mock data for orders
const mockOrders = [
  {
    id: "ORD-001",
    customerName: "John Doe",
    customerPhone: "+1 234-567-8900",
    items: [
      { name: "Tomatoes", quantity: "2 kg", price: 8.0 },
      { name: "Carrots", quantity: "1 kg", price: 4.5 },
      { name: "Onions", quantity: "1.5 kg", price: 3.75 },
    ],
    total: 16.25,
    status: "pending",
    orderTime: "2024-05-28 09:30 AM",
    deliveryAddress: "123 Green Street, Garden City",
  },
  {
    id: "ORD-002",
    customerName: "Sarah Wilson",
    customerPhone: "+1 234-567-8901",
    items: [
      { name: "Lettuce", quantity: "3 heads", price: 6.0 },
      { name: "Bell Peppers", quantity: "500g", price: 5.5 },
    ],
    total: 11.5,
    status: "preparing",
    orderTime: "2024-05-28 10:15 AM",
    deliveryAddress: "456 Fresh Avenue, Vegetable Town",
  },
  {
    id: "ORD-003",
    customerName: "Mike Johnson",
    customerPhone: "+1 234-567-8902",
    items: [
      { name: "Potatoes", quantity: "3 kg", price: 9.0 },
      { name: "Broccoli", quantity: "800g", price: 7.2 },
      { name: "Spinach", quantity: "500g", price: 4.8 },
    ],
    total: 21.0,
    status: "completed",
    orderTime: "2024-05-28 08:45 AM",
    deliveryAddress: "789 Organic Lane, Health District",
  },
  {
    id: "ORD-004",
    customerName: "Emma Davis",
    customerPhone: "+1 234-567-8903",
    items: [
      { name: "Cucumbers", quantity: "1 kg", price: 3.5 },
      { name: "Zucchini", quantity: "800g", price: 4.8 },
    ],
    total: 8.3,
    status: "pending",
    orderTime: "2024-05-28 11:00 AM",
    deliveryAddress: "321 Farm Road, Countryside",
  },
];

const mockProducts = [
  {
    id: "PROD-001",
    name: "Fresh Tomatoes",
    price: 4.0,
    unit: "kg",
    stock: 25,
    category: "Vegetables",
  },
  {
    id: "PROD-002",
    name: "Organic Carrots",
    price: 3.5,
    unit: "kg",
    stock: 15,
    category: "Vegetables",
  },
  {
    id: "PROD-003",
    name: "Red Onions",
    price: 2.5,
    unit: "kg",
    stock: 2,
    category: "Vegetables",
  },
];

const VendorDashboard = () => {
  const [orders, setOrders] = useState(mockOrders);
  const [products, setProducts] = useState(mockProducts);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [activeTab, setActiveTab] = useState("orders");
  const { toast } = useToast();

  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        const newOrder = {
          id: `ORD-${String(
            orders.length + Math.floor(Math.random() * 100)
          ).padStart(3, "0")}`,
          customerName: [
            "Alex Smith",
            "Lisa Brown",
            "David Wilson",
            "Maria Garcia",
          ][Math.floor(Math.random() * 4)],
          customerPhone: `+1 234-567-${
            Math.floor(Math.random() * 9000) + 1000
          }`,
          items: [{ name: "Mixed Vegetables", quantity: "2 kg", price: 12.0 }],
          total: 12.0,
          status: "pending",
          orderTime: new Date().toLocaleString(),
          deliveryAddress: "New Customer Address",
        };

        setOrders((prev) => [newOrder, ...prev]);

        const notification = {
          id: Date.now(),
          title: "New Order Received!",
          message: `Order ${newOrder.id} from ${newOrder.customerName}`,
          time: new Date().toLocaleTimeString(),
          type: "new-order",
        };

        setNotifications((prev) => [notification, ...prev.slice(0, 4)]);

        toast({
          title: "New Order! 🥬",
          description: `${newOrder.customerName} placed an order worth $${newOrder.total}`,
        });
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [orders.length, toast]);

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    const statusMessages = {
      packing: "Order moved to packing",
      "out-for-delivery": "Order is out for delivery",
      completed: "Order completed successfully",
    };

    toast({
      title: "Order Updated! 📦",
      description:
        statusMessages[newStatus] ||
        `Order ${orderId} status changed to ${newStatus}`,
    });
  };

  const handleSaveProduct = (productData) => {
    if (editingProduct) {
      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id
            ? { ...productData, id: editingProduct.id }
            : product
        )
      );
    } else {
      const newProduct = {
        ...productData,
        id: `PROD-${String(products.length + 1).padStart(3, "0")}`,
      };
      setProducts((prev) => [...prev, newProduct]);
    }

    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowProductModal(true);
  };

  const handleCloseModal = () => {
    setShowProductModal(false);
    setEditingProduct(null);
  };

  const pendingOrders = orders.filter((order) => order.status === "pending");
  const packingOrders = orders.filter((order) => order.status === "packing");
  const outForDeliveryOrders = orders.filter(
    (order) => order.status === "out-for-delivery"
  );
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  );
  const totalRevenue = orders
    .filter((order) => order.status === "completed")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 p-4">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-green-500" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
              Vendor Dashboard
            </h1>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full sm:w-auto">
            <div className="flex items-center gap-2 relative">
              <Button
                onClick={() => setShowNotifications(!showNotifications)}
                variant="outline"
                className="relative border-green-500 text-green-500 hover:bg-green-50"
              >
                <Bell className="h-4 w-4" />
                {notifications.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
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

              <Button
                onClick={() => setShowProductModal(true)}
                className="bg-green-500 hover:bg-green-600 text-white text-xs sm:text-sm px-3 py-2"
              >
                <Package className="h-4 w-4 mr-1" />
                Add Product
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
        <StatsCard
          title="Pending"
          value={pendingOrders.length}
          icon={Clock}
          color="orange"
        />
        <StatsCard
          title="Packing"
          value={packingOrders.length}
          icon={Package}
          color="blue"
        />
        <StatsCard
          title="Completed"
          value={completedOrders.length}
          icon={CheckCircle}
          color="green"
        />
        <StatsCard
          title="Revenue"
          value={`$${totalRevenue.toFixed(2)}`}
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      {/* Content based on active tab */}
      {activeTab === "orders" ? (
        <div className="space-y-6">
          <div className="block xl:hidden space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Pending Orders
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700"
                >
                  {pendingOrders.length}
                </Badge>
              </div>

              {pendingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                />
              ))}

              {pendingOrders.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="flex items-center justify-center p-6">
                    <p className="text-gray-500 text-sm">No pending orders</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800">Packing</h2>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {packingOrders.length}
                </Badge>
              </div>

              {packingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                />
              ))}

              {packingOrders.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="flex items-center justify-center p-6">
                    <p className="text-gray-500 text-sm">
                      No orders being packed
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Out for Delivery
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700"
                >
                  {outForDeliveryOrders.length}
                </Badge>
              </div>

              {outForDeliveryOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                />
              ))}

              {outForDeliveryOrders.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="flex items-center justify-center p-6">
                    <p className="text-gray-500 text-sm">
                      No orders out for delivery
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-800">
                  Completed
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  {completedOrders.length}
                </Badge>
              </div>

              {completedOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                  hideActions={true}
                />
              ))}

              {completedOrders.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="flex items-center justify-center p-6">
                    <p className="text-gray-500 text-sm">
                      No completed orders today
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>

          <div className="hidden xl:grid xl:grid-cols-4 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="h-5 w-5 text-orange-500" />
                <h2 className="text-xl font-semibold text-gray-800">Pending</h2>
                <Badge
                  variant="secondary"
                  className="bg-orange-100 text-orange-700"
                >
                  {pendingOrders.length}
                </Badge>
              </div>

              {pendingOrders.map((order) => (
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

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <Package className="h-5 w-5 text-blue-500" />
                <h2 className="text-xl font-semibold text-gray-800">Packing</h2>
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-700"
                >
                  {packingOrders.length}
                </Badge>
              </div>

              {packingOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                />
              ))}

              {packingOrders.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="flex items-center justify-center p-8">
                    <p className="text-gray-500">No orders being packed</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="h-5 w-5 text-purple-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Out for Delivery
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-purple-100 text-purple-700"
                >
                  {outForDeliveryOrders.length}
                </Badge>
              </div>

              {outForDeliveryOrders.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onUpdateStatus={updateOrderStatus}
                />
              ))}

              {outForDeliveryOrders.length === 0 && (
                <Card className="border-dashed border-2 border-gray-300">
                  <CardContent className="flex items-center justify-center p-8">
                    <p className="text-gray-500">No orders out for delivery</p>
                  </CardContent>
                </Card>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-4">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Completed
                </h2>
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-700"
                >
                  {completedOrders.length}
                </Badge>
              </div>

              {completedOrders.map((order) => (
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
      ) : (
        <ProductsList products={products} onEditProduct={handleEditProduct} />
      )}

      <ProductModal
        isOpen={showProductModal}
        onClose={handleCloseModal}
        onSave={handleSaveProduct}
        product={editingProduct}
      />
    </div>
  );
};

export default VendorDashboard;
