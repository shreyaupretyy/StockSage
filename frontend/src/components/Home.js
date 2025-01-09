import React from 'react';
import ChartComponent from './ChartComponent';
import MarketSummary from './MarketSummary';

const Home = () => {
    return (
        <div>
      <main className="px-6 py-8">
        <ChartComponent />
      </main>
      <div className='flex justify-center'>
      <h1 className='text-black-600 text-3xl font-bold'>Welcome to StockSage!</h1>
      </div>
      <MarketSummary />
    </div>
    );
};

export default Home;