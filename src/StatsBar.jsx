import React, { useMemo } from 'react';

export default function StatsBar({ data, metric }) {
  const stats = useMemo(() => {
    const totalJobs = data.reduce((acc, d) => acc + d.employment, 0);
    
    if (metric === 'ai_exposure') {
      const avgExposure = data.reduce((acc, d) => acc + (d.ai_exposure * d.employment), 0) / totalJobs;
      
      // Histogram [0-2), [2-4), [4-6), [6-8), [8-10]
      const hist = [0, 0, 0, 0, 0];
      data.forEach(d => {
        const bin = Math.min(Math.floor(d.ai_exposure / 2), 4);
        hist[bin] += d.employment;
      });
      const maxHist = Math.max(...hist);

      // Tiers
      let low = 0, mod = 0, high = 0;
      data.forEach(d => {
        if (d.ai_exposure <= 3) low += d.employment;
        else if (d.ai_exposure <= 6) mod += d.employment;
        else high += d.employment;
      });

      // By Education
      const eduMap = { "None": {e:0, t:0}, "Primary": {e:0, t:0}, "Secondary": {e:0, t:0}, "Diploma": {e:0, t:0}, "Bachelor's": {e:0, t:0}, "Master's+": {e:0, t:0} };
      data.forEach(d => {
        if(eduMap[d.education]) {
          eduMap[d.education].e += (d.ai_exposure * d.employment);
          eduMap[d.education].t += d.employment;
        }
      });
      const eduStats = Object.keys(eduMap).map(k => ({
        label: k,
        avg: eduMap[k].t ? eduMap[k].e / eduMap[k].t : 0
      }));

      // By Pay
      const payMap = { "< ₹2L": {e:0, t:0}, "₹2L - 5L": {e:0, t:0}, "₹5L - 10L": {e:0, t:0}, "₹10L+": {e:0, t:0} };
      data.forEach(d => {
        let bucket = "< ₹2L";
        if (d.median_pay >= 1000000) bucket = "₹10L+";
        else if (d.median_pay >= 500000) bucket = "₹5L - 10L";
        else if (d.median_pay >= 200000) bucket = "₹2L - 5L";
        payMap[bucket].e += (d.ai_exposure * d.employment);
        payMap[bucket].t += d.employment;
      });
      const payStats = Object.keys(payMap).map(k => ({
        label: k,
        avg: payMap[k].t ? payMap[k].e / payMap[k].t : 0
      }));

      return { type: 'ai', totalJobs, avgExposure, hist, maxHist, tiers: { low, mod, high }, eduStats, payStats };
    } else {
      // Metric: median_pay
      const avgPay = data.reduce((acc, d) => acc + (d.median_pay * d.employment), 0) / totalJobs;
      
      const hist = [0, 0, 0, 0, 0];
      data.forEach(d => {
        let bin = 0;
        if (d.median_pay > 1000000) bin = 4;
        else if (d.median_pay > 500000) bin = 3;
        else if (d.median_pay > 300000) bin = 2;
        else if (d.median_pay > 150000) bin = 1;
        hist[bin] += d.employment;
      });
      const maxHist = Math.max(...hist);

      let low = 0, mid = 0, high = 0;
      data.forEach(d => {
        if (d.median_pay < 200000) low += d.employment;
        else if (d.median_pay <= 600000) mid += d.employment;
        else high += d.employment;
      });

      return { type: 'pay', totalJobs, avgPay, hist, maxHist, tiers: { low, mid, high } };
    }
  }, [data, metric]);

  const formatNum = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
    return val.toLocaleString('en-IN');
  };

  const formatINR = (val) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`;
    return `₹${Math.round(val)}`;
  };

  if (stats.type === 'ai') {
    return (
      <div className="stats-bar">
        <div className="stat-block">
          <div className="stat-title">TOTAL JOBS</div>
          <div className="stat-value big">{formatNum(stats.totalJobs)}</div>
        </div>

        <div className="stat-block">
          <div className="stat-title">AVG. EXPOSURE</div>
          <div className="stat-value big" style={{ color: '#f59e0b' }}>{stats.avgExposure.toFixed(1)}</div>
          <div className="stat-subtitle">job-weighted</div>
        </div>

        <div className="stat-block">
          <div className="stat-title">JOBS BY EXPOSURE</div>
          <div className="hist-container">
            {stats.hist.map((val, i) => (
              <div key={i} className="hist-bar-wrapper">
                <div 
                  className="hist-bar" 
                  style={{ 
                    height: `${Math.max((val / stats.maxHist) * 100, 2)}%`,
                    backgroundColor: i < 2 ? 'rgb(15,80,20)' : i < 3 ? 'rgb(120,60,30)' : 'rgb(160,20,20)'
                  }} 
                />
              </div>
            ))}
          </div>
          <div className="hist-labels">
            <span>0</span><span>5</span><span>10</span>
          </div>
        </div>

        <div className="stat-block flex-2">
          <div className="stat-title">EXPOSURE TIERS</div>
          <div className="tier-row">
            <span className="tier-dot" style={{ background: 'rgb(15,80,20)' }}></span>
            <span className="tier-label">Low (0-3)</span>
            <span className="tier-val">{formatNum(stats.tiers.low)}</span>
            <span className="tier-pct">{Math.round(stats.tiers.low/stats.totalJobs*100)}%</span>
          </div>
          <div className="tier-row">
            <span className="tier-dot" style={{ background: 'rgb(120,60,30)' }}></span>
            <span className="tier-label">Moderate (4-6)</span>
            <span className="tier-val">{formatNum(stats.tiers.mod)}</span>
            <span className="tier-pct">{Math.round(stats.tiers.mod/stats.totalJobs*100)}%</span>
          </div>
          <div className="tier-row">
            <span className="tier-dot" style={{ background: 'rgb(160,20,20)' }}></span>
            <span className="tier-label">High (7-10)</span>
            <span className="tier-val">{formatNum(stats.tiers.high)}</span>
            <span className="tier-pct">{Math.round(stats.tiers.high/stats.totalJobs*100)}%</span>
          </div>
        </div>

        <div className="stat-block flex-2">
          <div className="stat-title">EXPOSURE BY PAY</div>
          {stats.payStats.map((p, i) => (
            <div className="hbar-row" key={i}>
              <span className="hbar-label">{p.label}</span>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: `${(p.avg/10)*100}%`, background: p.avg > 6 ? 'rgb(160,20,20)' : p.avg > 3 ? 'rgb(120,60,30)' : 'rgb(15,80,20)' }}></div>
              </div>
              <span className="hbar-val">{p.avg.toFixed(1)}</span>
            </div>
          ))}
        </div>

        <div className="stat-block flex-2">
          <div className="stat-title">EXPOSURE BY EDUCATION</div>
          {stats.eduStats.map((e, i) => (
            <div className="hbar-row" key={i}>
              <span className="hbar-label">{e.label}</span>
              <div className="hbar-track">
                <div className="hbar-fill" style={{ width: `${(e.avg/10)*100}%`, background: e.avg > 6 ? 'rgb(160,20,20)' : e.avg > 3 ? 'rgb(120,60,30)' : 'rgb(15,80,20)' }}></div>
              </div>
              <span className="hbar-val">{e.avg.toFixed(1)}</span>
            </div>
          ))}
        </div>

        <div className="stat-block">
          <div className="stat-title">HIGH RISK JOBS</div>
          <div className="stat-value big" style={{ color: 'rgb(220,40,40)' }}>{formatNum(stats.tiers.high)}</div>
          <div className="stat-subtitle">exposure &gt; 6</div>
        </div>

        <div className="stat-block">
          <div className="stat-title">LOW RISK JOBS</div>
          <div className="stat-value big" style={{ color: 'rgb(40,200,60)' }}>{formatNum(stats.tiers.low)}</div>
          <div className="stat-subtitle">exposure &lt;= 3</div>
        </div>

      </div>
    );
  }

  // Fallback for Median Pay metric
  return (
    <div className="stats-bar">
      <div className="stat-block">
        <div className="stat-title">TOTAL JOBS</div>
        <div className="stat-value big">{formatNum(stats.totalJobs)}</div>
      </div>
      <div className="stat-block">
        <div className="stat-title">AVG. PAY</div>
        <div className="stat-value big" style={{ color: '#10b981' }}>{formatINR(stats.avgPay)}</div>
        <div className="stat-subtitle">job-weighted</div>
      </div>
      <div className="stat-block flex-2">
        <div className="stat-title">PAY TIERS</div>
        <div className="tier-row">
          <span className="tier-dot" style={{ background: 'rgb(10,50,40)' }}></span>
          <span className="tier-label">&lt; ₹2L</span>
          <span className="tier-val">{formatNum(stats.tiers.low)}</span>
        </div>
        <div className="tier-row">
          <span className="tier-dot" style={{ background: 'rgb(30,150,60)' }}></span>
          <span className="tier-label">₹2L - ₹6L</span>
          <span className="tier-val">{formatNum(stats.tiers.mid)}</span>
        </div>
        <div className="tier-row">
          <span className="tier-dot" style={{ background: 'rgb(50,250,80)' }}></span>
          <span className="tier-label">&gt; ₹6L</span>
          <span className="tier-val">{formatNum(stats.tiers.high)}</span>
        </div>
      </div>
    </div>
  );
}
