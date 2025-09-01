import React from 'react';
import { Analytics } from '@vercel/analytics/react';
import HNReels from './components/HNReels';

function App() {
  return (
    <>
      <HNReels />
      <Analytics />
    </>
  );
}

export default App;