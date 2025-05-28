import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
}

interface CartItem extends Product {
  quantity: number;
}

const CustomerProducts = () => {
  const navigate = useNavigate();
  const [products] = useState<Product[]>([
    {
      id: "1",
      name: "Fresh Tomatoes",
      price: 49.99,
      unit: "kg",
      stock: 25,
      category: "Vegetables",
    },
    {
      id: "2",
      name: "Organic Carrots",
      price: 39.99,
      unit: "kg",
      stock: 18,
      category: "Vegetables",
    },
    {
      id: "3",
      name: "Green Lettuce",
      price: 29.99,
      unit: "piece",
      stock: 12,
      category: "Vegetables",
    },
    {
      id: "4",
      name: "Red Bell Peppers",
      price: 69.99,
      unit: "kg",
      stock: 8,
      category: "Vegetables",
    },
    {
      id: "5",
      name: "Fresh Spinach",
      price: 45.99,
      unit: "bunch",
      stock: 15,
      category: "Leafy Greens",
    },
    {
      id: "6",
      name: "Broccoli Crowns",
      price: 55.99,
      unit: "piece",
      stock: 10,
      category: "Vegetables",
    },
  ]);

  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (stock <= 5)
      return { label: "Low Stock", color: "bg-orange-100 text-orange-700" };
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  const formatQuantity = (item: CartItem) => {
    if (item.unit === "kg") {
      return `${item.quantity} kg`;
    } else if (item.unit === "dozen") {
      return `${item.quantity} dozen`;
    } else if (item.unit === "piece") {
      return `${item.quantity} pcs`;
    } else {
      return `${item.quantity} ${item.unit}`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Package className="h-6 w-6 text-green-500" />
            <h1 className="text-2xl font-bold text-gray-800">
              Fresh Produce Store
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => navigate("/customer-cart")}
              className="bg-green-500 hover:bg-green-600 relative"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Cart ({getCartItemCount()})
              {getCartItemCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs">
                  {getCartItemCount()}
                </Badge>
              )}
            </Button>
          </div>
        </div>

        {/* Cart Summary */}
        {cart.length > 0 && (
          <Card className="mb-6 border-green-200 bg-green-50">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <span className="text-sm font-medium text-green-700">
                  {getCartItemCount()} items in cart
                </span>
                <span className="text-lg font-bold text-green-700">
                  Total: ₹{getCartTotal().toFixed(2)}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            const cartItem = cart.find((item) => item.id === product.id);

            return (
              <Card
                key={product.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg font-semibold text-gray-800">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        {product.category}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-green-600">
                      ₹{product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      per {product.unit}
                    </span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Stock:</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {product.stock} {product.unit}
                        </span>
                        <Badge className={`text-xs ${stockStatus.color}`}>
                          {stockStatus.label}
                        </Badge>
                      </div>
                    </div>

                    {cartItem && (
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-green-600">In cart:</span>
                        <span className="font-medium text-green-600">
                          {formatQuantity(cartItem)}
                        </span>
                      </div>
                    )}
                  </div>

                  <Button
                    onClick={() => addToCart(product)}
                    disabled={product.stock === 0}
                    className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300"
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerProducts;
