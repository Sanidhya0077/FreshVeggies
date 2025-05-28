
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Package } from "lucide-react";

interface Product {
  id: string;
  name: string;
  price: number;
  unit: string;
  stock: number;
  category: string;
}

interface ProductsListProps {
  products: Product[];
  onEditProduct: (product: Product) => void;
}

const ProductsList = ({ products, onEditProduct }: ProductsListProps) => {
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: "Out of Stock", color: "bg-red-100 text-red-700" };
    if (stock <= 5) return { label: "Low Stock", color: "bg-orange-100 text-orange-700" };
    return { label: "In Stock", color: "bg-green-100 text-green-700" };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Package className="h-5 w-5 text-green-500" />
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Your Products</h2>
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          {products.length}
        </Badge>
      </div>

      {products.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300">
          <CardContent className="flex items-center justify-center p-6 sm:p-8">
            <p className="text-gray-500 text-sm sm:text-base">No products added yet. Add your first product!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => {
            const stockStatus = getStockStatus(product.stock);
            return (
              <Card key={product.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <CardTitle className="text-base font-semibold text-gray-800">
                        {product.name}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">{product.category}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEditProduct(product)}
                      className="h-8 w-8 text-gray-500 hover:text-green-600"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">per {product.unit}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Stock:</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{product.stock} {product.unit}</span>
                      <Badge className={`text-xs ${stockStatus.color}`}>
                        {stockStatus.label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ProductsList;
