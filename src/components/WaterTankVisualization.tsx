import React from 'react';

interface WaterTankVisualizationProps {
  income: number;
  expenses: { name: string; amount: number }[];
  remainingBalance: number;
}

const WaterTankVisualization: React.FC<WaterTankVisualizationProps> = ({
  income,
  expenses,
  remainingBalance,
}) => {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const maxAmount = Math.max(income, totalExpenses);
  const waterLevel = Math.max(0, Math.min(100, (remainingBalance / maxAmount) * 100));

  return (
    <div className="flex flex-col items-center p-6 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">แสดงภาพรายรับรายจ่าย</h3>
      
      <div className="relative">
        {/* Water inlet (income) */}
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <div className="text-green-600 font-semibold text-sm">รายรับ</div>
          <div className="text-green-700 font-bold">฿{income.toLocaleString()}</div>
          <div className="w-3 h-6 bg-blue-400 rounded-b-full animate-pulse"></div>
        </div>

        {/* Water tank */}
        <div className="relative w-32 h-40 border-4 border-gray-400 rounded-b-lg bg-gradient-to-t from-gray-200 to-gray-100 overflow-hidden">
          {/* Water level */}
          <div 
            className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-blue-500 to-blue-300 transition-all duration-1000 ease-in-out"
            style={{ height: `${waterLevel}%` }}
          >
            <div className="absolute top-0 left-0 right-0 h-2 bg-blue-400 opacity-70 animate-pulse"></div>
          </div>
          
          {/* Water level indicator */}
          <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full pr-2">
            <div className="text-xs text-gray-600">คงเหลือ</div>
            <div className="font-bold text-blue-600">฿{remainingBalance.toLocaleString()}</div>
          </div>
        </div>

        {/* Side drain faucets (expenses) - middle bottom area */}
        <div className="absolute bottom-8 right-0 flex flex-col space-y-3">
          {expenses.map((expense, index) => (
            <div key={index} className="flex items-center">
              <div className="text-right mr-2">
                <div className="text-xs text-gray-600">{expense.name}</div>
                <div className="text-red-600 font-semibold text-xs">-฿{expense.amount.toLocaleString()}</div>
              </div>
              
              {/* Side faucet protruding from tank */}
              <div className="relative">
                <div className="w-6 h-2 bg-gray-400 rounded-r-full"></div>
                <div className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-1 bg-gray-500 rounded-r-full"></div>
                
                {/* Water stream flowing out */}
                <div className="absolute -right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-8 h-0.5 bg-blue-400 opacity-70 animate-pulse"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce absolute -right-1 top-0"></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Total expenses indicator */}
        <div className="absolute right-0 -bottom-8 text-center">
          <div className="text-red-600 font-semibold text-sm">รายจ่ายรวม</div>
          <div className="text-red-700 font-bold">฿{totalExpenses.toLocaleString()}</div>
        </div>
      </div>

      {/* Balance status */}
      <div className="mt-6 text-center">
        <div className={`text-lg font-bold ${remainingBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {remainingBalance >= 0 ? 'เหลือเงิน' : 'ขาดเงิน'} ฿{Math.abs(remainingBalance).toLocaleString()}
        </div>
        {remainingBalance < 0 && (
          <div className="text-red-500 text-sm mt-1">⚠️ รายจ่ายเกินรายรับ</div>
        )}
      </div>
    </div>
  );
};

export default WaterTankVisualization;