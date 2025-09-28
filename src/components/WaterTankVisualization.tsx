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
  
  // Calculate positions for expenses in circular pattern
  const expensePositions = expenses.map((expense, index) => {
    const angle = (index / expenses.length) * 2 * Math.PI + Math.PI/4; // Start from top-right
    const radius = 35; // Distance from center
    const leftPosition = 50 + radius * Math.cos(angle); // Center is 50%
    const topPosition = 50 + radius * Math.sin(angle);
    return {
      ...expense,
      leftPosition: Math.min(85, Math.max(15, leftPosition)),
      topPosition: Math.min(85, Math.max(15, topPosition))
    };
  });

  return (
    <div className="flex flex-col items-center p-8 bg-gradient-to-br from-blue-900 via-teal-800 to-cyan-700 rounded-3xl shadow-2xl">
      <h3 className="text-3xl font-bold mb-8 text-white drop-shadow-lg">🐠 อ่างเลี้ยงปลาทอง - รายรับรายจ่าย 🐠</h3>
      
      <div className="relative">
        {/* Fish bowl shadow */}
        <div className="absolute top-4 left-4 w-80 h-80 bg-black opacity-25 rounded-full blur-lg"></div>
        
        {/* Main fish bowl - round like a jar */}
        <div className="relative w-80 h-80 bg-gradient-to-br from-cyan-100 via-blue-50 to-cyan-200 border-8 border-gray-400 rounded-full shadow-2xl overflow-hidden">
          
          {/* Bowl rim - top curved edge */}
          <div className="absolute -top-3 left-8 right-8 h-6 bg-gradient-to-b from-gray-300 to-gray-600 rounded-t-full shadow-lg"></div>
          <div className="absolute -top-1 left-4 right-4 h-4 bg-gradient-to-b from-gray-200 to-gray-500 rounded-t-full shadow-md"></div>
          
          {/* Water filling the tank */}
          <div className="absolute inset-0 bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-600 opacity-90">
            
            {/* Expenses overlay - red tint */}
            <div 
              className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-red-600 via-red-400 to-red-300 opacity-25"
              style={{ height: `${(totalExpenses / income) * 100}%` }}
            >
              {/* Expense flow effect */}
              <div className="absolute inset-0 bg-red-500 opacity-10 animate-pulse"></div>
            </div>
            
            {/* Water surface with ripples */}
            <div className="absolute top-0 left-0 right-0 h-6 bg-gradient-to-r from-cyan-200 via-white via-cyan-200 to-cyan-300 opacity-70 animate-pulse"></div>
            <div className="absolute top-2 left-0 right-0 h-2 bg-white opacity-40 animate-ping"></div>
            
            {/* Bubbles */}
            <div className="absolute bottom-8 left-12 w-2 h-2 bg-white opacity-60 rounded-full animate-bounce"></div>
            <div className="absolute bottom-16 right-20 w-1.5 h-1.5 bg-cyan-100 opacity-80 rounded-full animate-ping"></div>
            <div className="absolute bottom-12 left-32 w-1 h-1 bg-white opacity-70 rounded-full animate-bounce" style={{animationDelay: '0.5s'}}></div>
            <div className="absolute bottom-20 right-32 w-2.5 h-2.5 bg-white opacity-50 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
          </div>
          
          {/* Glass reflection effects */}
          <div className="absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-white to-transparent opacity-25"></div>
          <div className="absolute top-4 left-8 w-16 h-32 bg-white opacity-20 rounded-full blur-sm"></div>
          
          {/* Bowl decorations - rocks scattered around */}
          <div className="absolute bottom-4 left-16 w-8 h-6 bg-gradient-to-t from-gray-600 to-gray-400 rounded-full opacity-80"></div>
          <div className="absolute bottom-6 right-20 w-6 h-4 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full opacity-80"></div>
          <div className="absolute bottom-2 left-32 w-10 h-7 bg-gradient-to-t from-gray-800 to-gray-600 rounded-full opacity-70"></div>
          <div className="absolute bottom-3 right-32 w-5 h-3 bg-gradient-to-t from-gray-600 to-gray-400 rounded-full opacity-75"></div>
          <div className="absolute bottom-8 left-40 w-7 h-5 bg-gradient-to-t from-gray-700 to-gray-500 rounded-full opacity-80"></div>
          
          {/* Aquatic plants around the bowl edges */}
          <div className="absolute bottom-0 left-20 w-2 h-20 bg-gradient-to-t from-green-800 to-green-400 opacity-70 transform rotate-15 rounded-t-full"></div>
          <div className="absolute bottom-0 left-24 w-1.5 h-16 bg-gradient-to-t from-green-700 to-green-300 opacity-80 transform -rotate-8 rounded-t-full"></div>
          <div className="absolute bottom-0 right-24 w-2 h-24 bg-gradient-to-t from-green-900 to-green-500 opacity-60 transform rotate-8 rounded-t-full"></div>
          <div className="absolute bottom-0 right-28 w-1.5 h-18 bg-gradient-to-t from-green-800 to-green-400 opacity-75 transform -rotate-15 rounded-t-full"></div>
          <div className="absolute bottom-0 left-48 w-1.5 h-14 bg-gradient-to-t from-green-700 to-green-500 opacity-70 transform rotate-20 rounded-t-full"></div>
          <div className="absolute bottom-0 right-48 w-1.5 h-16 bg-gradient-to-t from-green-800 to-green-300 opacity-80 transform -rotate-10 rounded-t-full"></div>

          {/* Swimming goldfish in circular patterns */}
          <div className="absolute bottom-20 left-20 animate-bounce" style={{animationDuration: '3s', animationDelay: '0s'}}>
            <div className="text-2xl transform rotate-45">🐠</div>
          </div>
          <div className="absolute bottom-32 right-28 animate-bounce" style={{animationDuration: '4s', animationDelay: '1s'}}>
            <div className="text-xl transform -rotate-30 scale-x-[-1]">🐟</div>
          </div>
          <div className="absolute bottom-24 left-48 animate-bounce" style={{animationDuration: '2.5s', animationDelay: '0.5s'}}>
            <div className="text-lg transform rotate-60">🐡</div>
          </div>
          <div className="absolute bottom-36 right-20 animate-bounce" style={{animationDuration: '3.5s', animationDelay: '2s'}}>
            <div className="text-xl transform -rotate-15 scale-x-[-1]">🐠</div>
          </div>
          <div className="absolute bottom-28 left-36 animate-bounce" style={{animationDuration: '2.8s', animationDelay: '1.5s'}}>
            <div className="text-lg transform rotate-30">🐟</div>
          </div>
          <div className="absolute bottom-40 left-28 animate-bounce" style={{animationDuration: '3.2s', animationDelay: '0.8s'}}>
            <div className="text-sm transform -rotate-45">🐡</div>
          </div>

          {/* Income text floating in center of bowl */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="bg-blue-800 bg-opacity-80 px-6 py-3 rounded-full shadow-lg border border-cyan-300 text-center backdrop-blur-sm">
              <div className="text-cyan-200 font-bold text-lg">💰 รายรับ</div>
              <div className="text-white font-black text-2xl drop-shadow-lg">฿{income.toLocaleString()}</div>
            </div>
          </div>

          {/* Individual expense texts floating around the bowl in circular pattern */}
          {expensePositions.map((expense, index) => (
            <div 
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{ 
                left: `${expense.leftPosition}%`,
                top: `${expense.topPosition}%`
              }}
            >
              <div className="bg-red-800 bg-opacity-85 px-3 py-2 rounded-full shadow-lg border border-red-400 text-center backdrop-blur-sm">
                <div className="text-red-200 font-semibold text-sm">{expense.name}</div>
                <div className="text-red-100 font-bold text-base">฿{expense.amount.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Bowl stand - jar/pottery style */}
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-64 h-12 bg-gradient-to-b from-gray-400 to-gray-700 rounded-full shadow-xl"></div>
        <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-72 h-8 bg-gradient-to-b from-gray-300 to-gray-600 rounded-full shadow-lg"></div>
        <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-76 h-6 bg-gradient-to-b from-gray-200 to-gray-500 rounded-full shadow-md"></div>
      </div>

      {/* Control panel - aquarium style */}
      <div className="mt-12 flex flex-wrap justify-center gap-6">
        {/* Total expenses */}
        <div className="bg-red-900 bg-opacity-80 px-6 py-4 rounded-xl shadow-lg border border-red-400 text-center backdrop-blur-sm">
          <div className="text-red-200 font-bold text-lg">🔴 รายจ่ายรวม</div>
          <div className="text-red-100 font-black text-xl drop-shadow-lg">฿{totalExpenses.toLocaleString()}</div>
          <div className="text-red-300 text-sm mt-1">{((totalExpenses / income) * 100).toFixed(1)}% ของรายรับ</div>
        </div>

        {/* Balance status */}
        <div className="bg-black bg-opacity-50 px-6 py-4 rounded-xl shadow-lg border border-white border-opacity-30 text-center backdrop-blur-sm">
          <div className={`text-xl font-black drop-shadow-lg ${remainingBalance >= 0 ? 'text-green-300' : 'text-red-300'}`}>
            {remainingBalance >= 0 ? '💰 เหลือเงิน' : '💸 ขาดเงิน'}
          </div>
          <div className={`font-black text-2xl drop-shadow-lg ${remainingBalance >= 0 ? 'text-green-200' : 'text-red-200'}`}>
            ฿{Math.abs(remainingBalance).toLocaleString()}
          </div>
          {remainingBalance < 0 && (
            <div className="text-red-300 text-sm mt-1 animate-pulse">
              ⚠️ ปลาหิว! เงินไม่พอ
            </div>
          )}
          {remainingBalance >= 0 && (
            <div className="text-green-300 text-sm mt-1">
              ✨ ปลาแฮปปี้! เงินเหลือ
            </div>
          )}
        </div>

        {/* Water quality indicator */}
        <div className="bg-teal-800 bg-opacity-80 px-6 py-4 rounded-xl shadow-lg border border-teal-400 text-center backdrop-blur-sm">
          <div className="text-teal-200 font-bold text-lg">🌊 คุณภาพน้ำ</div>
          <div className={`font-black text-xl ${remainingBalance >= 0 ? 'text-green-300' : 'text-yellow-300'}`}>
            {remainingBalance >= 0 ? 'ดีเยี่ยม' : 'ต้องดูแล'}
          </div>
          <div className="text-teal-300 text-sm mt-1">
            {remainingBalance >= 0 ? '🐠 ปลาสุขภาพดี' : '😰 ปลาเครียด'}
          </div>
        </div>
      </div>

      {/* Expense usage bar - aquarium style */}
      <div className="mt-6 w-full max-w-md">
        <div className="bg-gray-800 bg-opacity-60 rounded-full h-5 overflow-hidden shadow-inner border-2 border-cyan-400 border-opacity-30">
          <div 
            className="h-full bg-gradient-to-r from-red-500 via-orange-400 to-red-500 transition-all duration-1000 ease-out shadow-lg"
            style={{ width: `${Math.min(100, (totalExpenses / income) * 100)}%` }}
          ></div>
        </div>
        <div className="text-center text-white text-sm mt-2 opacity-80 flex items-center justify-center gap-2">
          <span>🐟</span>
          <span>การใช้จ่าย {((totalExpenses / income) * 100).toFixed(1)}%</span>
          <span>🐟</span>
        </div>
      </div>
    </div>
  );
};

// Demo component
const Demo = () => {
  const sampleData = {
    income: 50000,
    expenses: [
      { name: "อาหาร", amount: 15000 },
      { name: "ค่าเช่า", amount: 12000 },
      { name: "เดินทาง", amount: 8000 },
      { name: "ช้อปปิ้ง", amount: 5000 }
    ],
    remainingBalance: 10000
  };

  return (
    <div className="mb-8">
      <WaterTankVisualization {...sampleData} />
    </div>
  );
};

export default Demo;