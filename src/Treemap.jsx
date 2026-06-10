import React, { useMemo, useState } from 'react';
import * as d3 from 'd3-hierarchy';

export default function Treemap({ data, metric }) {
  const [hoverNode, setHoverNode] = useState(null);

  const hierarchyData = useMemo(() => {
    const root = { name: "India Jobs", children: [] };
    const categoriesMap = {};
    
    data.forEach(d => {
      if (!categoriesMap[d.category]) {
        categoriesMap[d.category] = { name: d.category, children: [] };
        root.children.push(categoriesMap[d.category]);
      }
      categoriesMap[d.category].children.push({
        ...d,
        name: d.title,
        value: d.employment
      });
    });
    
    return root;
  }, [data]);

  const getColor = (node) => {
    if (!node.data.title) return 'transparent';
    
    if (metric === 'ai_exposure') {
      const val = node.data.ai_exposure;
      // Red-Green heatmap scale
      // 0 (Low Exposure) -> Green
      // 5 (Medium Exposure) -> Olive/Brown
      // 10 (High Exposure) -> Red
      
      // Interpolate from dark green (15, 80, 20) to dark red (160, 20, 20)
      const t = val / 10;
      
      let r, g, b;
      if (t < 0.5) {
        // Green to Brown
        const t2 = t * 2; // 0 to 1
        r = Math.round(15 + t2 * 105);
        g = Math.round(80 - t2 * 20);
        b = Math.round(20 + t2 * 10);
      } else {
        // Brown to Red
        const t2 = (t - 0.5) * 2; // 0 to 1
        r = Math.round(120 + t2 * 40);
        g = Math.round(60 - t2 * 40);
        b = Math.round(30 - t2 * 10);
      }
      return `rgb(${r},${g},${b})`;
    }
    
    if (metric === 'median_pay') {
      const val = node.data.median_pay;
      const t = Math.min(Math.max((val - 100000) / 2000000, 0), 1);
      const r = Math.round(10 + t * 40);
      const g = Math.round(50 + t * 200);
      const b = Math.round(40 + t * 40);
      return `rgb(${r},${g},${b})`;
    }
    
    return '#4b5563';
  };

  const { nodes, width, height } = useMemo(() => {
    const w = 1200;
    const h = 800;
    
    const root = d3.hierarchy(hierarchyData)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value);

    // Padding set to 0 for the exact touching-blocks look in the screenshot
    d3.treemap()
      .size([w, h])
      .paddingInner(0)
      .paddingOuter(0)
      (root);

    return { nodes: root.leaves(), width: w, height: h };
  }, [hierarchyData]);

  const formatINR = (val) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(1)} Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} L`;
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const formatNum = (val) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M`;
    if (val >= 100000) return `${(val / 100000).toFixed(1)}L`;
    return val.toLocaleString('en-IN');
  };

  return (
    <>
      <div className="treemap-container">
        {nodes.map((node, i) => {
          const left = `${(node.x0 / width) * 100}%`;
          const top = `${(node.y0 / height) * 100}%`;
          const nodeWidth = `${((node.x1 - node.x0) / width) * 100}%`;
          const nodeHeight = `${((node.y1 - node.y0) / height) * 100}%`;
          
          // Show labels if block is minimally large enough to hold some text
          const isLargeEnough = (node.x1 - node.x0) > 30 && (node.y1 - node.y0) > 20;

          return (
            <div
              key={i}
              className="treemap-node"
              style={{
                left,
                top,
                width: nodeWidth,
                height: nodeHeight,
                backgroundColor: getColor(node)
              }}
              onMouseEnter={(e) => {
                setHoverNode({
                  data: node.data,
                  x: e.clientX,
                  y: e.clientY
                });
              }}
              onMouseMove={(e) => {
                setHoverNode(prev => prev ? { ...prev, x: e.clientX, y: e.clientY } : null);
              }}
              onMouseLeave={() => setHoverNode(null)}
            >
              {isLargeEnough && (
                <>
                  <div className="node-label">{node.data.title}</div>
                  <div className="node-sublabel">
                    {metric === 'ai_exposure' 
                      ? `${node.data.ai_exposure}/10 · ${formatNum(node.data.employment)} jobs` 
                      : `${formatINR(node.data.median_pay)} · ${formatNum(node.data.employment)} jobs`}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="legend">
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f0f0f5' }}>
          {metric === 'ai_exposure' ? 'AI Digital Exposure' : 'Median Annual Pay'}
        </div>
        <div>
          <div className="legend-bar" style={{
            background: metric === 'ai_exposure' 
              ? 'linear-gradient(to right, rgb(15,80,20), rgb(120,60,30), rgb(160,20,20))'
              : 'linear-gradient(to right, rgb(10,50,40), rgb(50,250,80))'
          }} />
          <div className="legend-labels">
            {metric === 'ai_exposure' ? (
              <><span>0 (Low)</span><span>10 (High)</span></>
            ) : (
              <><span>Lower Pay</span><span>Higher Pay</span></>
            )}
          </div>
        </div>
      </div>

      {hoverNode && (
        <div 
          className="tooltip"
          style={{
            left: hoverNode.x + 15,
            top: hoverNode.y + 15,
            transform: hoverNode.x > window.innerWidth - 350 ? 'translateX(-110%)' : 'none'
          }}
        >
          <div className="tooltip-title">{hoverNode.data.title}</div>
          <div className="tooltip-category">{hoverNode.data.category}</div>
          
          <div className="tooltip-stats">
            <div className="stat-label">Total Employment</div>
            <div className="stat-val">{formatNum(hoverNode.data.employment)}</div>
            
            <div className="stat-label">Median Annual Pay</div>
            <div className="stat-val">{formatINR(hoverNode.data.median_pay)}</div>
            
            <div className="stat-label">AI Digital Exposure</div>
            <div className="stat-val" style={{ color: '#fff' }}>{hoverNode.data.ai_exposure} / 10</div>
            
            <div className="stat-label">Education</div>
            <div className="stat-val">{hoverNode.data.education}</div>
          </div>

          <div className="tooltip-rationale">
            <strong>Rationale:</strong> {hoverNode.data.rationale}
          </div>
        </div>
      )}
    </>
  );
}
