
import { Package, ShoppingCart, ArrowRight, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const LandingPage = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Header */}
        <div className="text-center mb-12 relative">
          {user && (
            <div className="absolute top-0 right-0 flex items-center gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                {user.email}
              </div>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </Button>
            </div>
          )}
          
          <div className="flex items-center justify-center gap-3 mb-4">
            <Package className="h-12 w-12 text-green-500" />
            <h1 className="text-4xl font-bold text-gray-800">VeggieMart</h1>
          </div>
          <p className="text-xl text-gray-600">Fresh vegetables delivered to your doorstep</p>
          
          {!user && (
            <Button 
              onClick={() => navigate('/auth')}
              variant="outline"
              className="mt-4"
            >
              Sign In / Sign Up
            </Button>
          )}
        </div>

        {/* Role Selection Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {/* Customer Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-300">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-blue-100 rounded-full">
                  <ShoppingCart className="h-12 w-12 text-blue-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-800">Continue as Customer</CardTitle>
              <CardDescription className="text-gray-600">
                Browse fresh vegetables, add to cart, and place orders
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Browse fresh vegetables
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Add items to cart
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Secure payment process
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Track your orders
                </li>
              </ul>
              <Button 
                onClick={() => user ? navigate('/customer-products') : navigate('/auth')}
                className="w-full bg-blue-500 hover:bg-blue-600 text-white"
                size="lg"
              >
                Shop Now <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>

          {/* Vendor Card */}
          <Card className="hover:shadow-lg transition-shadow duration-300 border-2 hover:border-green-300">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-green-100 rounded-full">
                  <Package className="h-12 w-12 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl text-gray-800">Continue as Vendor</CardTitle>
              <CardDescription className="text-gray-600">
                Manage orders, track inventory, and grow your business
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Manage incoming orders
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Track order status
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Manage product inventory
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  View sales analytics
                </li>
              </ul>
              <Button 
                onClick={() => user ? navigate('/vendor-dashboard') : navigate('/auth')}
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                size="lg"
              >
                Manage Store <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500">
          <p className="text-sm">
            {user ? 'Welcome back! Choose your role to continue.' : 'Sign in or create an account to get started with VeggieMart'}
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
