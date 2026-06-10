import json
import random

# Total workforce ~ 550M
# We will create specific occupations under these categories and distribute the total category employment among them.
# Added many more jobs for richer analysis.

categories = {
    "Managers": {"total": 11_000_000, "occupations": [
        {"title": "Chief Executives & Senior Officials", "share": 0.05, "pay": 2400000, "edu": "Master's+", "ai": 6.5, "rationale": "High-level decision making."},
        {"title": "Business Services & Admin Managers", "share": 0.15, "pay": 1200000, "edu": "Bachelor's", "ai": 7.5, "rationale": "Digital coordination and process optimization."},
        {"title": "Retail & Wholesale Trade Managers", "share": 0.20, "pay": 600000, "edu": "Secondary", "ai": 4.0, "rationale": "Physical retail management."},
        {"title": "Production & Manufacturing Managers", "share": 0.15, "pay": 850000, "edu": "Bachelor's", "ai": 5.0, "rationale": "Factory environments with digital oversight."},
        {"title": "Hospitality & Restaurant Managers", "share": 0.10, "pay": 500000, "edu": "Secondary", "ai": 3.0, "rationale": "Interpersonal and physical environment."},
        {"title": "Financial & Insurance Managers", "share": 0.10, "pay": 1500000, "edu": "Bachelor's", "ai": 8.0, "rationale": "Heavily digital and analytical."},
        {"title": "Sales & Marketing Managers", "share": 0.10, "pay": 1100000, "edu": "Bachelor's", "ai": 7.0, "rationale": "Digital marketing and strategy."},
        {"title": "Human Resources Managers", "share": 0.05, "pay": 900000, "edu": "Bachelor's", "ai": 6.5, "rationale": "Interpersonal but heavily reliant on HRIS systems."},
        {"title": "Construction Managers", "share": 0.05, "pay": 800000, "edu": "Bachelor's", "ai": 4.0, "rationale": "On-site physical management with some digital planning."},
        {"title": "Education & Health Managers", "share": 0.05, "pay": 700000, "edu": "Master's+", "ai": 5.0, "rationale": "Institutional management, moderate digital exposure."}
    ]},
    "Professionals": {"total": 22_000_000, "occupations": [
        {"title": "Software Developers & Engineers", "share": 0.20, "pay": 1500000, "edu": "Bachelor's", "ai": 9.5, "rationale": "Core digital work, heavily exposed to AI coding."},
        {"title": "Primary & Secondary School Teachers", "share": 0.25, "pay": 450000, "edu": "Bachelor's", "ai": 6.0, "rationale": "Physical classroom presence required."},
        {"title": "Medical Doctors & Surgeons", "share": 0.08, "pay": 1800000, "edu": "Master's+", "ai": 5.5, "rationale": "High physical care requirements."},
        {"title": "Accountants & Auditors", "share": 0.10, "pay": 750000, "edu": "Bachelor's", "ai": 8.5, "rationale": "Highly digital structured data processing."},
        {"title": "Lawyers & Legal Professionals", "share": 0.05, "pay": 900000, "edu": "Master's+", "ai": 8.0, "rationale": "Text analysis and case law research."},
        {"title": "Writers, Journalists & Content Creators", "share": 0.03, "pay": 600000, "edu": "Bachelor's", "ai": 9.0, "rationale": "Digital text and media generation."},
        {"title": "University & Higher Education Teachers", "share": 0.05, "pay": 900000, "edu": "Master's+", "ai": 7.0, "rationale": "Research and teaching, high digital integration."},
        {"title": "Civil & Mechanical Engineers", "share": 0.08, "pay": 800000, "edu": "Bachelor's", "ai": 6.0, "rationale": "Design software automation but physical execution."},
        {"title": "Architects & Town Planners", "share": 0.02, "pay": 700000, "edu": "Bachelor's", "ai": 6.5, "rationale": "Digital drafting and design generation."},
        {"title": "Graphic Designers & Artists", "share": 0.04, "pay": 500000, "edu": "Bachelor's", "ai": 9.0, "rationale": "Highly exposed to generative image AI."},
        {"title": "Data Scientists & Analysts", "share": 0.05, "pay": 1600000, "edu": "Bachelor's", "ai": 9.5, "rationale": "Advanced digital data processing."},
        {"title": "Registered Nurses", "share": 0.05, "pay": 500000, "edu": "Bachelor's", "ai": 4.0, "rationale": "Physical healthcare delivery."}
    ]},
    "Technicians and Associate Professionals": {"total": 11_000_000, "occupations": [
        {"title": "IT Support & Network Technicians", "share": 0.15, "pay": 480000, "edu": "Diploma", "ai": 7.0, "rationale": "Troubleshooting can be automated."},
        {"title": "Nursing & Midwifery Professionals", "share": 0.20, "pay": 360000, "edu": "Diploma", "ai": 3.5, "rationale": "High physical care."},
        {"title": "Accounting & Financial Assistants", "share": 0.15, "pay": 300000, "edu": "Diploma", "ai": 8.5, "rationale": "Routine ledger balancing."},
        {"title": "Engineering Technicians", "share": 0.10, "pay": 420000, "edu": "Diploma", "ai": 4.5, "rationale": "Hands-on machinery testing."},
        {"title": "Medical Lab Technicians", "share": 0.08, "pay": 350000, "edu": "Diploma", "ai": 5.0, "rationale": "Lab testing, some AI diagnostic assist."},
        {"title": "Pharmaceutical Technicians", "share": 0.05, "pay": 320000, "edu": "Diploma", "ai": 4.0, "rationale": "Dispensing medication."},
        {"title": "Legal Assistants & Paralegals", "share": 0.04, "pay": 400000, "edu": "Diploma", "ai": 8.5, "rationale": "Document review and prep."},
        {"title": "Sales & Purchasing Agents", "share": 0.10, "pay": 450000, "edu": "Diploma", "ai": 6.5, "rationale": "B2B sales and procurement routing."},
        {"title": "Real Estate Agents", "share": 0.05, "pay": 500000, "edu": "Secondary", "ai": 5.0, "rationale": "Physical property tours, digital listings."},
        {"title": "Fitness Instructors", "share": 0.05, "pay": 250000, "edu": "Secondary", "ai": 2.0, "rationale": "Physical training and motivation."},
        {"title": "Police Inspectors & Detectives", "share": 0.03, "pay": 600000, "edu": "Bachelor's", "ai": 5.0, "rationale": "Field work with digital surveillance analysis."}
    ]},
    "Clerical Support Workers": {"total": 11_000_000, "occupations": [
        {"title": "General Office Clerks", "share": 0.20, "pay": 240000, "edu": "Secondary", "ai": 9.5, "rationale": "Routine digital processing."},
        {"title": "Customer Service Reps", "share": 0.20, "pay": 300000, "edu": "Secondary", "ai": 9.0, "rationale": "Voice and text AI agents."},
        {"title": "Bank Tellers & Clerks", "share": 0.15, "pay": 360000, "edu": "Bachelor's", "ai": 8.5, "rationale": "Routine financial transactions."},
        {"title": "Receptionists", "share": 0.10, "pay": 216000, "edu": "Secondary", "ai": 7.0, "rationale": "Scheduling and greeting."},
        {"title": "Data Entry Operators", "share": 0.10, "pay": 200000, "edu": "Secondary", "ai": 9.5, "rationale": "Pure manual digital transcription."},
        {"title": "Payroll Clerks", "share": 0.05, "pay": 280000, "edu": "Secondary", "ai": 9.0, "rationale": "Automated wage calculation."},
        {"title": "Library & Filing Clerks", "share": 0.05, "pay": 180000, "edu": "Secondary", "ai": 8.0, "rationale": "Digital cataloging."},
        {"title": "Mail Carriers & Postal Clerks", "share": 0.10, "pay": 220000, "edu": "Secondary", "ai": 4.0, "rationale": "Physical delivery."},
        {"title": "Transport & Logistics Clerks", "share": 0.05, "pay": 250000, "edu": "Secondary", "ai": 7.5, "rationale": "Routing and tracking."}
    ]},
    "Service and Sales Workers": {"total": 66_000_000, "occupations": [
        {"title": "Shop Sales Assistants", "share": 0.30, "pay": 180000, "edu": "Secondary", "ai": 3.0, "rationale": "In-person customer interaction."},
        {"title": "Street Vendors", "share": 0.20, "pay": 144000, "edu": "Primary", "ai": 0.5, "rationale": "Informal physical commerce."},
        {"title": "Personal Care Workers", "share": 0.10, "pay": 150000, "edu": "Secondary", "ai": 1.0, "rationale": "Physical empathetic care."},
        {"title": "Cooks & Food Prep Workers", "share": 0.10, "pay": 180000, "edu": "Primary", "ai": 1.5, "rationale": "Physical food preparation."},
        {"title": "Security Guards", "share": 0.08, "pay": 180000, "edu": "Secondary", "ai": 3.5, "rationale": "Physical presence."},
        {"title": "Waiters & Bartenders", "share": 0.07, "pay": 150000, "edu": "Secondary", "ai": 2.0, "rationale": "Physical serving."},
        {"title": "Hairdressers & Beauticians", "share": 0.05, "pay": 160000, "edu": "Secondary", "ai": 1.0, "rationale": "Physical personal service."},
        {"title": "Childcare Workers", "share": 0.05, "pay": 120000, "edu": "Secondary", "ai": 1.5, "rationale": "Physical supervision."},
        {"title": "Travel Guides & Attendants", "share": 0.02, "pay": 200000, "edu": "Secondary", "ai": 4.0, "rationale": "In-person guidance, but AI can curate info."},
        {"title": "Police Officers (Patrol)", "share": 0.03, "pay": 350000, "edu": "Secondary", "ai": 3.0, "rationale": "Physical law enforcement."}
    ]},
    "Skilled Agricultural, Forestry and Fishery Workers": {"total": 220_000_000, "occupations": [
        {"title": "Crop & Vegetable Farmers", "share": 0.50, "pay": 120000, "edu": "Primary", "ai": 1.5, "rationale": "Physical labor in fields."},
        {"title": "Livestock & Dairy Farmers", "share": 0.20, "pay": 144000, "edu": "Primary", "ai": 1.5, "rationale": "Physical animal care."},
        {"title": "Poultry Farmers", "share": 0.05, "pay": 160000, "edu": "Primary", "ai": 2.0, "rationale": "Automated feeding, mostly manual."},
        {"title": "Fishery Workers & Aquaculture", "share": 0.05, "pay": 130000, "edu": "Primary", "ai": 1.0, "rationale": "Physical outdoor work on water."},
        {"title": "Forestry & Logging Workers", "share": 0.05, "pay": 110000, "edu": "Primary", "ai": 0.5, "rationale": "Heavy physical manual labor."},
        {"title": "Plantation Workers (Tea/Coffee)", "share": 0.05, "pay": 100000, "edu": "Primary", "ai": 0.5, "rationale": "Manual harvesting."},
        {"title": "Horticulturists & Gardeners", "share": 0.05, "pay": 120000, "edu": "Primary", "ai": 1.0, "rationale": "Physical landscaping."},
        {"title": "Subsistence Farmers", "share": 0.05, "pay": 80000, "edu": "None", "ai": 0.0, "rationale": "Survival farming."}
    ]},
    "Craft and Related Trades Workers": {"total": 66_000_000, "occupations": [
        {"title": "Carpenters & Joiners", "share": 0.15, "pay": 240000, "edu": "Primary", "ai": 1.0, "rationale": "Physical construction."},
        {"title": "Bricklayers & Stonemasons", "share": 0.15, "pay": 200000, "edu": "Primary", "ai": 1.0, "rationale": "Physical building."},
        {"title": "Garment & Textile Trades (Tailors)", "share": 0.15, "pay": 180000, "edu": "Primary", "ai": 2.0, "rationale": "Physical fabric manipulation."},
        {"title": "Machinery Mechanics & Repairers", "share": 0.10, "pay": 300000, "edu": "Secondary", "ai": 3.0, "rationale": "Physical repair work."},
        {"title": "Electrical Trades Workers", "share": 0.10, "pay": 360000, "edu": "Secondary", "ai": 3.5, "rationale": "Wiring and electronics."},
        {"title": "Plumbers & Pipefitters", "share": 0.08, "pay": 280000, "edu": "Secondary", "ai": 1.5, "rationale": "Physical installation."},
        {"title": "Welders & Flame Cutters", "share": 0.07, "pay": 250000, "edu": "Secondary", "ai": 2.0, "rationale": "Metal joining."},
        {"title": "Painters & Decorators", "share": 0.05, "pay": 220000, "edu": "Primary", "ai": 1.0, "rationale": "Surface coating."},
        {"title": "Food Processing (Bakers/Butchers)", "share": 0.05, "pay": 200000, "edu": "Primary", "ai": 1.5, "rationale": "Physical food prep."},
        {"title": "Jewelry & Precious Metal Workers", "share": 0.05, "pay": 300000, "edu": "Secondary", "ai": 2.5, "rationale": "Fine manual crafting."}
    ]},
    "Plant and Machine Operators, and Assemblers": {"total": 33_000_000, "occupations": [
        {"title": "Heavy Truck & Bus Drivers", "share": 0.25, "pay": 240000, "edu": "Secondary", "ai": 4.5, "rationale": "Exposed to autonomous vehicle AI."},
        {"title": "Car, Taxi & Van Drivers", "share": 0.20, "pay": 216000, "edu": "Secondary", "ai": 5.0, "rationale": "Routing managed by AI."},
        {"title": "Stationary Plant Operators", "share": 0.15, "pay": 260000, "edu": "Secondary", "ai": 5.5, "rationale": "Monitoring machinery."},
        {"title": "Assembly Line Workers", "share": 0.15, "pay": 190000, "edu": "Primary", "ai": 3.0, "rationale": "Physical repetitive labor."},
        {"title": "Locomotive Engine Drivers", "share": 0.05, "pay": 500000, "edu": "Secondary", "ai": 6.0, "rationale": "Fixed track automation."},
        {"title": "Earthmoving Plant Operators", "share": 0.05, "pay": 300000, "edu": "Secondary", "ai": 4.0, "rationale": "Heavy machinery driving."},
        {"title": "Crane & Hoist Operators", "share": 0.05, "pay": 280000, "edu": "Secondary", "ai": 3.5, "rationale": "Precision lifting."},
        {"title": "Textile & Sewing Machine Operators", "share": 0.10, "pay": 150000, "edu": "Primary", "ai": 2.5, "rationale": "Manual machine operation."}
    ]},
    "Elementary Occupations": {"total": 110_000_000, "occupations": [
        {"title": "Agricultural Labourers", "share": 0.35, "pay": 96000, "edu": "None", "ai": 0.0, "rationale": "Unskilled manual labor in fields."},
        {"title": "Construction Labourers", "share": 0.20, "pay": 144000, "edu": "None", "ai": 0.0, "rationale": "Heavy physical manual labor."},
        {"title": "Domestic Cleaners & Helpers", "share": 0.15, "pay": 120000, "edu": "None", "ai": 0.0, "rationale": "In-home physical cleaning."},
        {"title": "Manufacturing Labourers", "share": 0.10, "pay": 132000, "edu": "Primary", "ai": 1.0, "rationale": "Manual lifting and packing."},
        {"title": "Street Cleaners & Refuse Workers", "share": 0.05, "pay": 108000, "edu": "None", "ai": 0.0, "rationale": "Physical outdoor cleaning."},
        {"title": "Delivery Drivers & Messengers", "share": 0.05, "pay": 180000, "edu": "Secondary", "ai": 3.0, "rationale": "Last mile physical delivery, AI routing."},
        {"title": "Hand Packers", "share": 0.05, "pay": 120000, "edu": "Primary", "ai": 1.0, "rationale": "Manual packaging."},
        {"title": "Vehicle Cleaners", "share": 0.05, "pay": 100000, "edu": "None", "ai": 0.0, "rationale": "Manual washing."}
    ]}
}

data_out = []
id_counter = 1

for cat_name, cat_data in categories.items():
    cat_total = cat_data["total"]
    for occ in cat_data["occupations"]:
        occ_total = int(cat_total * occ["share"])
        data_out.append({
            "id": f"OCC-{id_counter:03d}",
            "category": cat_name,
            "title": occ["title"],
            "employment": occ_total,
            "median_pay": occ["pay"],
            "education": occ["edu"],
            "ai_exposure": occ["ai"],
            "rationale": occ["rationale"]
        })
        id_counter += 1

# Sort by employment descending
data_out.sort(key=lambda x: x["employment"], reverse=True)

import os
os.makedirs("src/data", exist_ok=True)
with open("src/data/occupations.json", "w") as f:
    json.dump(data_out, f, indent=2)

print(f"Data successfully generated ({len(data_out)} jobs) at src/data/occupations.json")
