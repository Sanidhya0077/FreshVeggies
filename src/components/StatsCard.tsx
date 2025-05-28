
import { Card, CardContent } from "@/components/ui/card";

const StatsCard = ({ title, value, icon: Icon, color }) => {
  const getColorClasses = (color) => {
    switch (color) {
      case 'orange':
        return 'text-orange-600 bg-orange-100';
      case 'blue':
        return 'text-blue-600 bg-blue-100';
      case 'green':
        return 'text-green-600 bg-green-100';
      case 'emerald':
        return 'text-emerald-600 bg-emerald-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200 border-l-4 border-l-green-400">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
          <div className={`p-3 rounded-full ${getColorClasses(color)}`}>
            <Icon className="h-6 w-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatsCard;
