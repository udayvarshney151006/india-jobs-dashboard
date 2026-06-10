import React, { useState } from 'react';
import { Database, TrendingUp, IndianRupee, Zap, Sparkles } from 'lucide-react';
import Treemap from './Treemap';
import StatsBar from './StatsBar';
import data from './data/occupations.json';

function App() {
  const [metric, setMetric] = useState('ai_exposure'); // 'ai_exposure' | 'median_pay'

  return (
    <div className="app-container">
      <header className="header">
        <h1>
          <span>India Job Market Visualizer</span>
          <span className="header-badge">NCO-2015 DATA</span>
        </h1>
        <p>
          This dashboard visualizes the Indian workforce modeled on <strong>NCO-2015</strong> occupational data and PLFS distributions, covering approximately <strong>550 Million jobs</strong> across the economy. Each rectangle's <strong>area</strong> is proportional to total employment. <strong>Color</strong> shows the selected metric.
        </p>
        <p>
          <Sparkles className="inline-icon" size={16} style={{ display: 'inline', marginRight: '4px', color: '#a855f7' }} />
          <strong>LLM-powered coloring:</strong> Similar to Karpathy's US Jobs dashboard, the <i>Digital AI Exposure</i> score estimates how much current generative AI will reshape each Indian occupation. It ranges from 0 (highly physical/informal work, e.g. Agricultural Labourers) to 10 (fully digital knowledge work, e.g. Software Developers).
        </p>
      </header>

      <div className="controls">
        <span className="controls-label">Color By Metric:</span>
        <div className="button-group">
          <button 
            className={`toggle-btn ${metric === 'ai_exposure' ? 'active' : ''}`}
            onClick={() => setMetric('ai_exposure')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Zap size={16} /> Digital AI Exposure
          </button>
          <button 
            className={`toggle-btn ${metric === 'median_pay' ? 'active' : ''}`}
            onClick={() => setMetric('median_pay')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <IndianRupee size={16} /> Median Annual Pay
          </button>
        </div>
      </div>

      <StatsBar data={data} metric={metric} />

      <Treemap data={data} metric={metric} />

    </div>
  );
}

export default App;
