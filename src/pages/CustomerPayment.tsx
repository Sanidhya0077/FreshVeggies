import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  CreditCard,
  Package,
  Smartphone,
  Building2,
  QrCode,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const CustomerPayment = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isProcessing, setIsProcessing] = useState(false);
  const [upiId, setUpiId] = useState("");
  const [cardData, setCardData] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });
  const [address, setAddress] = useState({
    address: "",
    city: "",
    zipCode: "",
  });

  const cart = JSON.parse(localStorage.getItem("cart") || "[]");
  const subtotal = cart.reduce(
    (total: number, item: any) => total + item.price * item.quantity,
    0
  );
  const deliveryFee = 3.99;
  const total = subtotal + deliveryFee;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith("card")) {
      setCardData((prev) => ({ ...prev, [name]: value }));
    } else {
      setAddress((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpiChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUpiId(e.target.value);
  };

  const processPayment = async () => {
    setIsProcessing(true);

    // Simulate payment processing
    setTimeout(() => {
      const orderId = "ORD-" + Date.now();
      const orderData = {
        id: orderId,
        items: cart,
        total: total,
        status: "confirmed",
        orderTime: new Date().toISOString(),
        deliveryAddress: `${address.address}, ${address.city}, ${address.zipCode}`,
        paymentMethod: paymentMethod,
      };

      localStorage.setItem("currentOrder", JSON.stringify(orderData));
      localStorage.removeItem("cart");

      navigate("/customer-tracking");
    }, 2000);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-600 mb-2">
                No items to checkout
              </h2>
              <p className="text-gray-500 mb-6">
                Add some items to your cart first!
              </p>
              <Button
                onClick={() => navigate("/customer-products")}
                className="bg-green-500 hover:bg-green-600"
              >
                Shop Now
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <CreditCard className="h-6 w-6 text-green-500" />
          <h1 className="text-2xl font-bold text-gray-800">Payment</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Payment Methods */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs
                  defaultValue="card"
                  className="w-full"
                  onValueChange={setPaymentMethod}
                >
                  <TabsList className="grid grid-cols-3 mb-6">
                    <TabsTrigger
                      value="card"
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="h-4 w-4" />
                      Card
                    </TabsTrigger>
                    <TabsTrigger
                      value="upi"
                      className="flex items-center gap-2"
                    >
                      <Smartphone className="h-4 w-4" />
                      UPI
                    </TabsTrigger>
                    <TabsTrigger
                      value="netbanking"
                      className="flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      Net Banking
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="card" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="cardNumber">Card Number</Label>
                      <Input
                        id="cardNumber"
                        name="cardNumber"
                        value={cardData.cardNumber}
                        onChange={handleInputChange}
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          value={cardData.expiryDate}
                          onChange={handleInputChange}
                          placeholder="MM/YY"
                          maxLength={5}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="cvv">CVV</Label>
                        <Input
                          id="cvv"
                          name="cvv"
                          type="password"
                          value={cardData.cvv}
                          onChange={handleInputChange}
                          placeholder="123"
                          maxLength={3}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cardholderName">Cardholder Name</Label>
                      <Input
                        id="cardholderName"
                        name="cardholderName"
                        value={cardData.cardholderName}
                        onChange={handleInputChange}
                        placeholder="John Doe"
                      />
                    </div>
                  </TabsContent>

                  <TabsContent value="upi" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="upiId">UPI ID</Label>
                      <Input
                        id="upiId"
                        value={upiId}
                        onChange={handleUpiChange}
                        placeholder="username@upi"
                      />
                    </div>
                    <div className="flex justify-center p-4 border rounded-lg">
                      <div className="text-center">
                        <QrCode className="h-32 w-32 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-500">
                          Scan QR code to pay
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <Button variant="outline" className="w-full">
                        <img
                          src="/gpay.png"
                          alt="Google Pay"
                          className="h-6 mr-2"
                        />
                        Google Pay
                      </Button>
                      <Button variant="outline" className="w-full">
                        <img
                          src="/phonepe.png"
                          alt="PhonePe"
                          className="h-6 mr-2"
                        />
                        PhonePe
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="netbanking" className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="bank">Select Bank</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select your bank" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="sbi">
                            State Bank of India
                          </SelectItem>
                          <SelectItem value="hdfc">HDFC Bank</SelectItem>
                          <SelectItem value="icici">ICICI Bank</SelectItem>
                          <SelectItem value="axis">Axis Bank</SelectItem>
                          <SelectItem value="kotak">
                            Kotak Mahindra Bank
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Delivery Address</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={address.address}
                    onChange={handleInputChange}
                    placeholder="Enter your delivery address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      name="city"
                      value={address.city}
                      onChange={handleInputChange}
                      placeholder="Enter your city"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="zipCode">PIN Code</Label>
                    <Input
                      id="zipCode"
                      name="zipCode"
                      value={address.zipCode}
                      onChange={handleInputChange}
                      placeholder="Enter PIN code"
                      maxLength={6}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  {cart.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Delivery Fee:</span>
                    <span>₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total:</span>
                      <span>₹{total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={processPayment}
                  className="w-full bg-green-500 hover:bg-green-600 mt-6"
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Pay Now"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPayment;
