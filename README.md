# India Job Market Visualizer Dashboard

An interactive, treemap-based visualization of the Indian workforce, modeled to represent approximately **550 Million jobs** across the Indian economy.

This project is deeply inspired by [Andrej Karpathy's US Jobs Visualizer](https://karpathy.ai/jobs/) but is completely tailored and rebuilt for the unique macro-economic structure of India.

![Dashboard Preview](./src/assets/hero.png)

## 📊 Data Methodology & Sources

The data presented in this dashboard is a **synthesized model** designed for macroeconomic visualization and analysis. 

Because official, highly granular unit-level microdata in India requires extensive offline statistical processing, this project utilizes robust macro-estimates derived from highly credible sources to generate a representative layout of the workforce:

1. **Occupational Framework:** 
   All occupations and job titles are strictly categorized using the **National Classification of Occupations (NCO-2015)** standard, maintained by the Ministry of Labour and Employment, Government of India. This aligns with the global ISCO-2008 standards.

2. **Employment Distribution Estimates:** 
   The total workforce scale (approx. 550 Million) and the relative employment sizes across different sectors (Agriculture, Manufacturing, Services, Elementary work) are modeled based on the annual **Periodic Labour Force Survey (PLFS)** reports conducted by the National Statistical Office (NSO) under the Ministry of Statistics and Programme Implementation (MoSPI). 

3. **Digital AI Exposure Scoring:** 
   Following the methodology from Karpathy's original project, the "Digital AI Exposure" score (0-10) is generated via an LLM evaluation pipeline. It estimates how much *generative AI* will reshape an occupation. 
   - **0 (Low):** Minimal exposure. The work is almost entirely physical, hands-on, or requires real-time human presence (e.g., Agricultural Labourers, Construction Workers).
   - **10 (High):** Maximum exposure. Routine information processing, fully digital, with no physical component (e.g., Software Developers, Data Entry Clerks).

### Official References:
- [MoSPI Periodic Labour Force Survey (PLFS)](https://www.mospi.gov.in/)
- [National Classification of Occupations (NCO-2015) - NCS](https://www.ncs.gov.in/)
- [Karpathy's Original Project & LLM Prompt](https://github.com/karpathy/jobs)

## 🚀 Running Locally

This project is built using Vite, React, and D3.js.

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

## 🛠️ Features
- **Squarified Treemap Layout**: Efficient spatial representation using `d3-hierarchy` where the area is strictly proportional to employment size.
- **Dynamic Heatmaps**: Switch between color scales for **Digital AI Exposure** (Red/Green Heatmap) and **Median Annual Pay**.
- **Interactive Tooltips**: Hover over any occupation to view its specific AI rationale, estimated pay, and educational requirements.
