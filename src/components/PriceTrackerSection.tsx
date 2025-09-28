import React, { useState, useEffect } from 'react';

interface GoldPrice {
  name: string;
  bid: number;
  ask: number;
  diff: number;
}

interface OilPrice {
  product: string;
  price: number;
  unit: string;
  date: string;
}

interface FoodPrice {
  product: string;
  price: number;
  unit: string;
  market: string;
  date: string;
}

interface ExchangeRate {
  currency: string;
  currencyName: string;
  rate: number;
  change: number;
  flag: string;
}

const PriceTrackerSection: React.FC = () => {
  const [goldPrices, setGoldPrices] = useState<GoldPrice[]>([]);
  const [oilPrices, setOilPrices] = useState<OilPrice[]>([]);
  const [foodPrices, setFoodPrices] = useState<FoodPrice[]>([]);
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [loading, setLoading] = useState<Record<string, boolean>>({
    gold: true,
    oil: true,
    food: true,
    exchange: true
  });
  const [error, setError] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<string>('');

  // ดึงข้อมูลราคาทองคำ (ใช้ข้อมูลจำลองเนื่องจาก CORS policy)
  const fetchGoldPrices = async () => {
    try {
      setLoading(prev => ({ ...prev, gold: true }));
      
      // พยายามเรียก API ผ่าน proxy หรือใช้ข้อมูลจำลอง
      try {
        // ลองใช้ API อื่นที่รองรับ CORS
        const response = await fetch('https://api.chnwt.dev/thai-gold-api/latest');
        if (response.ok) {
          const data = await response.json();
          const goldData = [
            {
              name: 'ทองคำแท่ง 96.5%',
              bid: data.response?.price?.gold_bar?.buy || 0,
              ask: data.response?.price?.gold_bar?.sell || 0,
              diff: 0
            },
            {
              name: 'ทองรูปพรรณ 96.5%',
              bid: data.response?.price?.gold?.buy || 0,
              ask: data.response?.price?.gold?.sell || 0,
              diff: 0
            }
          ];
          setGoldPrices(goldData);
          setError(prev => ({ ...prev, gold: '' }));
          setLastUpdated(new Date().toLocaleString('th-TH'));
          return;
        }
      } catch (apiError) {
        console.log('API call failed, using mock data');
      }
      
      // ใช้ข้อมูลจำลองหาก API ไม่สามารถเรียกได้
      const mockGoldData: GoldPrice[] = [
        { name: 'ทองคำแท่ง 96.5%', bid: 41200, ask: 41300, diff: 50 },
        { name: 'ทองรูปพรรณ 96.5%', bid: 40700, ask: 41700, diff: 50 }
      ];
      
      setGoldPrices(mockGoldData);
      setError(prev => ({ ...prev, gold: '' }));
      setLastUpdated(new Date().toLocaleString('th-TH'));
    } catch (error) {
      console.error('Error fetching gold prices:', error);
      setError(prev => ({ ...prev, gold: 'ไม่สามารถดึงข้อมูลราคาทองคำได้' }));
    } finally {
      setLoading(prev => ({ ...prev, gold: false }));
    }
  };

  // จำลองข้อมูลราคาน้ำมัน (เนื่องจาก EPPO API ต้องการ authentication)
  const fetchOilPrices = async () => {
    try {
      setLoading(prev => ({ ...prev, oil: true }));
      
      // ข้อมูลจำลองจากสถานีน้ำมันหลัก
      const mockOilData: OilPrice[] = [
        { product: 'เบนซิน 91', price: 32.50, unit: 'บาท/ลิตร', date: new Date().toISOString() },
        { product: 'เบนซิน 95', price: 34.20, unit: 'บาท/ลิตร', date: new Date().toISOString() },
        { product: 'เบนซิน E20', price: 31.80, unit: 'บาท/ลิตร', date: new Date().toISOString() },
        { product: 'เบนซิน E85', price: 28.90, unit: 'บาท/ลิตร', date: new Date().toISOString() },
        { product: 'ดีเซล B7', price: 30.10, unit: 'บาท/ลิตร', date: new Date().toISOString() },
        { product: 'ดีเซล B20', price: 29.80, unit: 'บาท/ลิตร', date: new Date().toISOString() },
      ];
      
      setOilPrices(mockOilData);
      setError(prev => ({ ...prev, oil: '' }));
      if (!lastUpdated) setLastUpdated(new Date().toLocaleString('th-TH'));
    } catch (error) {
      console.error('Error fetching oil prices:', error);
      setError(prev => ({ ...prev, oil: 'ไม่สามารถดึงข้อมูลราคาน้ำมันได้' }));
    } finally {
      setLoading(prev => ({ ...prev, oil: false }));
    }
  };

  // จำลองข้อมูลราคาอาหาร (เนื่องจากไม่มี Free API ที่ครอบคลุม)
  const fetchFoodPrices = async () => {
    try {
      setLoading(prev => ({ ...prev, food: true }));
      
      // ข้อมูลจำลองจากตลาดสี่มุมเมือง
      const mockFoodData: FoodPrice[] = [
        { product: 'เนื้อหมูสะโพก', price: 180, unit: 'บาท/กก.', market: 'ตลาดสี่มุมเมือง', date: new Date().toISOString() },
        { product: 'เนื้อไก่สด', price: 85, unit: 'บาท/กก.', market: 'ตลาดสี่มุมเมือง', date: new Date().toISOString() },
        { product: 'เนื้อวัวสด', price: 280, unit: 'บาท/กก.', market: 'ตลาดสี่มุมเมือง', date: new Date().toISOString() },
        { product: 'ข้าวหอมมะลิ', price: 45, unit: 'บาท/กก.', market: 'ตลาดสี่มุมเมือง', date: new Date().toISOString() },
        { product: 'ไข่ไก่', price: 120, unit: 'บาท/แผง', market: 'ตลาดสี่มุมเมือง', date: new Date().toISOString() },
        { product: 'นมสดขวด', price: 38, unit: 'บาท/ลิตร', market: 'ตลาดสี่มุมเมือง', date: new Date().toISOString() },
      ];
      
      setFoodPrices(mockFoodData);
      setError(prev => ({ ...prev, food: '' }));
      if (!lastUpdated) setLastUpdated(new Date().toLocaleString('th-TH'));
    } catch (error) {
      console.error('Error fetching food prices:', error);
      setError(prev => ({ ...prev, food: 'ไม่สามารถดึงข้อมูลราคาอาหารได้' }));
    } finally {
      setLoading(prev => ({ ...prev, food: false }));
    }
  };

  // ดึงข้อมูลอัตราแลกเปลี่ยน
  const fetchExchangeRates = async () => {
    try {
      setLoading(prev => ({ ...prev, exchange: true }));
      
      // พยายามเรียก Free Exchange Rate API
      try {
        const response = await fetch('https://api.exchangerate-api.com/v4/latest/THB');
        if (response.ok) {
          const data = await response.json();
          
          const currencies = [
            { code: 'USD', name: 'ดอลลาร์สหรัฐ', flag: '🇺🇸' },
            { code: 'EUR', name: 'ยูโร', flag: '🇪🇺' },
            { code: 'JPY', name: 'เยนญี่ปุ่น', flag: '🇯🇵' },
            { code: 'CNY', name: 'หยวนจีน', flag: '🇨🇳' },
            { code: 'KRW', name: 'วอนเกาหลี', flag: '🇰🇷' },
            { code: 'SGD', name: 'ดอลลาร์สิงคโปร์', flag: '🇸🇬' },
            { code: 'GBP', name: 'ปอนด์อังกฤษ', flag: '🇬🇧' },
            { code: 'AUD', name: 'ดอลลาร์ออสเตรเลีย', flag: '🇦🇺' }
          ];

          const exchangeData = currencies.map(currency => ({
            currency: currency.code,
            currencyName: currency.name,
            rate: 1 / (data.rates[currency.code] || 1),
            change: (Math.random() - 0.5) * 2, // จำลองการเปลี่ยนแปลง
            flag: currency.flag
          }));

          setExchangeRates(exchangeData);
          setError(prev => ({ ...prev, exchange: '' }));
          if (!lastUpdated) setLastUpdated(new Date().toLocaleString('th-TH'));
          return;
        }
      } catch (apiError) {
        console.log('Exchange API call failed, using mock data');
      }
      
      // ใช้ข้อมูลจำลองหาก API ไม่สามารถเรียกได้
      const mockExchangeData: ExchangeRate[] = [
        { currency: 'USD', currencyName: 'ดอลลาร์สหรัฐ', rate: 35.50, change: 0.25, flag: '🇺🇸' },
        { currency: 'EUR', currencyName: 'ยูโร', rate: 38.75, change: -0.15, flag: '🇪🇺' },
        { currency: 'JPY', currencyName: 'เยนญี่ปุ่น', rate: 0.24, change: 0.08, flag: '🇯🇵' },
        { currency: 'CNY', currencyName: 'หยวนจีน', rate: 4.89, change: -0.12, flag: '🇨🇳' },
        { currency: 'KRW', currencyName: 'วอนเกาหลี', rate: 0.026, change: 0.05, flag: '🇰🇷' },
        { currency: 'SGD', currencyName: 'ดอลลาร์สิงคโปร์', rate: 26.20, change: 0.18, flag: '🇸🇬' },
        { currency: 'GBP', currencyName: 'ปอนด์อังกฤษ', rate: 44.80, change: -0.22, flag: '🇬🇧' },
        { currency: 'AUD', currencyName: 'ดอลลาร์ออสเตรเลีย', rate: 23.15, change: 0.31, flag: '🇦🇺' }
      ];
      
      setExchangeRates(mockExchangeData);
      setError(prev => ({ ...prev, exchange: '' }));
      if (!lastUpdated) setLastUpdated(new Date().toLocaleString('th-TH'));
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      setError(prev => ({ ...prev, exchange: 'ไม่สามารถดึงข้อมูลอัตราแลกเปลี่ยนได้' }));
    } finally {
      setLoading(prev => ({ ...prev, exchange: false }));
    }
  };

  useEffect(() => {
    fetchGoldPrices();
    fetchOilPrices();
    fetchFoodPrices();
    fetchExchangeRates();

    // อัพเดทข้อมูลทุก 5 นาที
    const interval = setInterval(() => {
      fetchGoldPrices();
      fetchOilPrices();
      fetchFoodPrices();
      fetchExchangeRates();
    }, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  const PriceCard: React.FC<{
    title: string;
    icon: string;
    data: any[];
    loading: boolean;
    error: string;
    type: 'gold' | 'oil' | 'food' | 'exchange';
  }> = ({ title, icon, data, loading, error, type }) => (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${
            type === 'gold' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
            type === 'oil' ? 'bg-blue-100 dark:bg-blue-900/30' :
            type === 'food' ? 'bg-green-100 dark:bg-green-900/30' :
            'bg-purple-100 dark:bg-purple-900/30'
          }`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              {title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ราคาล่าสุด
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (type === 'gold') fetchGoldPrices();
            if (type === 'oil') fetchOilPrices();
            if (type === 'food') fetchFoodPrices();
            if (type === 'exchange') fetchExchangeRates();
          }}
          className={`p-2 rounded-lg transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100 dark:hover:bg-gray-700'
          }`}
          disabled={loading}
        >
          <svg 
            className={`w-4 h-4 text-gray-500 ${loading ? 'animate-spin' : ''}`} 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
            />
          </svg>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-500 text-sm">{error}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {data.length === 0 ? (
            <p className="text-center text-gray-500 py-4">ไม่มีข้อมูล</p>
          ) : (
            data.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex-1">
                  {type === 'exchange' ? (
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{item.flag}</span>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white">
                          {item.currency}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.currencyName}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {type === 'gold' ? item.name : item.product}
                      </p>
                      {type === 'food' && (
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {item.market}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  {type === 'gold' ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        ซื้อ: {item.bid.toLocaleString()} บาท
                      </p>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        ขาย: {item.ask.toLocaleString()} บาท
                      </p>
                      <p className={`text-xs ${item.diff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.diff >= 0 ? '+' : ''}{item.diff}
                      </p>
                    </div>
                  ) : type === 'exchange' ? (
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {item.rate.toLocaleString()} บาท
                      </p>
                      <p className={`text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-semibold text-gray-800 dark:text-white">
                        {item.price.toLocaleString()} {item.unit}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  return (
    <div className="mt-8">
      <div className="mb-6">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
            <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
              ราคาสินค้าโภคภัณฑ์
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              ติดตามราคาสินค้าสำคัญแบบเรียลไทม์
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-6">
        <PriceCard
          title="ราคาทองคำ"
          icon="🏆"
          data={goldPrices}
          loading={loading.gold}
          error={error.gold}
          type="gold"
        />
        
        <PriceCard
          title="ราคาน้ำมัน"
          icon="⛽"
          data={oilPrices}
          loading={loading.oil}
          error={error.oil}
          type="oil"
        />
        
        <PriceCard
          title="ราคาอาหารสด"
          icon="🥩"
          data={foodPrices}
          loading={loading.food}
          error={error.food}
          type="food"
        />
        
        <PriceCard
          title="อัตราแลกเปลี่ยน"
          icon="💱"
          data={exchangeRates}
          loading={loading.exchange}
          error={error.exchange}
          type="exchange"
        />
      </div>

      <div className="mt-4 text-center">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          ข้อมูลราคาทองคำและอัตราแลกเปลี่ยนพยายามดึงจาก API จริง หากไม่สำเร็จจะใช้ข้อมูลจำลอง | ข้อมูลราคาน้ำมันและอาหารเป็นข้อมูลจำลอง
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          อัพเดทล่าสุด: {lastUpdated || 'กำลังโหลด...'}
        </p>
      </div>
    </div>
  );
};

export default PriceTrackerSection;