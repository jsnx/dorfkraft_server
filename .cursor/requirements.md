# Bakery Fleet Management Tool - Requirements Document

## Table of Contents
- [Introduction and Overview](#introduction-and-overview)
- [Assumptions and Clarifications](#assumptions-and-clarifications)
- [Functional Requirements](#functional-requirements)
- [Non-Functional Requirements](#non-functional-requirements)
- [Development Approach](#development-approach)
- [Additional Considerations](#additional-considerations)
- [System Integration Details](#system-integration-details)

## Introduction and Overview

The bakery fleet management tool is designed to streamline delivery operations to villages in Germany without nearby supermarkets or bakeries. The tool aims to:

- Optimize product selection and quantities to minimize overproduction and waste
- Enhance route efficiency and value through intelligent planning
- Leverage AI for demand forecasting and route optimization
- Prepare for future fleet automation

### System Context

The bakery operates a fleet of vehicles, each assigned a dynamic set of villages that may change over time. The system must integrate with:

- **POS Systems**: Vectron, KORONA POS, Lightspeed, SumUp, and Square
- **Inventory Tools**: OptiBack, KORONA POS, FoodReady, Craftybase, SOS Inventory, and StockTake Online

## Assumptions and Clarifications

### Core Assumptions

1. Vehicle Operations:
   - Predefined village sets, adjustable monthly
   - Algorithm-based daily village selection
   
2. System Integration:
   - Integration with top 5 German POS systems
   - Integration with major inventory management tools
   
3. Device Usage:
   - Tablets: Drivers and loaders
   - Smartphones: Drivers
   - Desktops: Fleet managers

### Resolved Clarifications

1. **Route Constraints**: 
   - Minimum weekly visits per village
   - Configurable by managers

2. **Priority Features**:
   - Phase 1: Demand forecasting, route planning, POS integration

3. **Security**:
   - GDPR compliance
   - AES-256 encryption
   - Role-based access control

## Functional Requirements

### 1. Demand Forecasting

**Purpose**: Predict daily product demand per village

**Details**:
- Historical sales data analysis
- Variable consideration (seasonality, holidays, weather)
- 90% confidence intervals
- Weekly AI model retraining

**I/O**:
- Input: POS sales data, weather API, holiday calendar
- Output: CSV/dashboard demand reports

### 2. Production Planning

**Purpose**: Determine bakery-wide production totals based on aggregated demand

**Details**:
- Sum forecasted demand across all selected villages daily
- Subtract current inventory levels (via OptiBack integration) to calculate production needs
- Allow manual adjustments by managers (e.g., +10% for unexpected demand), logged with reasons

**I/O**:
- Input: Demand forecasts, inventory data
- Output: Production list (e.g., "Bake 280 loaves, 140 pastries")

### 3. Vehicle and Village Assignment

**Purpose**: Assign villages to vehicles daily for optimal delivery

**Details**:
- Maintain a database of vehicle-village assignments, editable monthly via the management dashboard
- Algorithm selects daily villages using:
  - Demand: Prioritize high-demand villages (e.g., >20 loaves)
  - Inventory: Match available stock (e.g., prioritize villages needing perishable items in stock)
  - Capacity: Respect vehicle limits (e.g., 500 kg or 2 m³)
  - Distance/Time: Minimize travel (e.g., <100 km total)
  - Costs: Factor fuel (€1.50/L, 10 L/100 km) and driver hours (€15/hr)
  - Revenue: Maximize sales potential (e.g., €2/loaf)

**Example**: Vehicle 1 assigned 5 of 10 possible villages based on highest demand-to-cost ratio

**Constraint**: Each village visited at least weekly unless demand is zero

**I/O**:
- Input: Demand forecasts, inventory, vehicle specs, fuel costs
- Output: Daily village list per vehicle

### 4. Product Allocation to Vehicles

**Purpose**: Distribute products to vehicles for selected villages

**Details**:
- Allocate based on village demand (e.g., Village A: 20 loaves, 10 pastries)
- Respect vehicle capacity (e.g., max 500 kg, with loaf = 0.5 kg, pastry = 0.1 kg)
- Add a 10% buffer (configurable) for uncertainty (e.g., 22 loaves instead of 20)
- Sequence allocation by route order to ensure stock availability (e.g., Village A first, then B)
- Allow manual overrides by loaders or managers

**I/O**:
- Input: Village demand, vehicle capacity, route sequence
- Output: Loading list per vehicle (e.g., "Vehicle 1: 110 loaves, 55 pastries")

### 5. Route Optimization

**Purpose**: Plan efficient routes for each vehicle's selected villages

**Details**:
- Use a Traveling Salesman Problem (TSP) solver (e.g., Google OR-Tools) with:
  - Minimize: Total distance or time (e.g., <2 hours travel)
  - Maximize: Revenue potential (optional weight configurable by managers)
- Inputs: Village coordinates (via mapping API), traffic data (if available), driver hours (max 8/day)
- Output: Ordered route (e.g., Bakery → Village A → Village C → Bakery)
- Allow manual rerouting with justification (e.g., road closure)

**I/O**:
- Input: Village list, mapping API data
- Output: Route map and turn-by-turn directions

### 6. Driver and Loader Interfaces

#### Loader Interface (Tablet)

- Display loading list per vehicle (e.g., "Vehicle 1: 110 loaves, 55 pastries")
- Confirm quantities loaded via checkbox or numeric entry
- Show real-time inventory from OptiBack (e.g., "200 loaves available")

#### Driver Interface (Smartphone)

- Show route map, schedule (e.g., "Village A: 8:00 AM"), and product list
- Integrate with Google Maps for navigation
- Record sales via POS apps (e.g., Vectron: scan barcode, log "20 loaves sold")
- Report issues (e.g., "Village B closed") with photo upload option
- Work offline, syncing sales/inventory when online

### 7. Management Dashboard

**Purpose**: Provide fleet oversight and control

**Details**:
- Real-time view: Vehicle locations (GPS), sales progress (e.g., "Vehicle 1: €200 sold")
- Analytics: Sales by product/village, waste (e.g., 5% unsold), route efficiency (km/€)
- Adjust parameters: Buffer size (10% → 15%), visit frequency (weekly → biweekly)
- Export reports: PDF/CSV (e.g., "Weekly Sales: €5,000")

**I/O**:
- Input: Driver data, POS sales, vehicle telemetry
- Output: Dashboard views, reports

### 8. AI and Machine Learning Integration

**Purpose**: Enhance forecasting and optimization

**Details**:
- Use ML for demand forecasting (e.g., LSTM model on sales data)
- Retrain weekly, logging accuracy (e.g., "MAE: 5 loaves")
- Optional ML for route optimization (e.g., reinforcement learning on historical routes)
- Show prediction explanations (e.g., "+10 loaves due to holiday")

**Sustainability Features**

**Purpose**: Reduce environmental impact

**Details**:
- Optimize routes for fuel efficiency (e.g., <10 L/day/vehicle)
- Report CO2 emissions (e.g., "2 kg CO2/km") and waste (e.g., "10 loaves unsold")

**Output**: Sustainability dashboard

**Future Automation Readiness**

**Purpose**: Enable scalability to automated systems

**Details**:
- Provide APIs for automated loading (e.g., IoT conveyor integration)
- Support autonomous vehicle protocols (e.g., CAN bus data exchange)

**Output**: API documentation

## Non-Functional Requirements

### Performance
- Plan generation: <15 minutes daily
- User capacity: 50 simultaneous users

### Scalability
- Initial: 50 vehicles, 500 villages
- Target: 200 vehicles, 2000 villages

### Security
- Encryption: AES-256
- Transport: TLS 1.3
- Access: Role-based control
- Compliance: GDPR

## Development Approach

### Phase 1: Core Features (Months 1-6)
- Basic demand forecasting
- Production planning
- Village assignment
- Driver/loader interfaces
- Basic dashboard

### Phase 2: Enhancements (Months 7-10)
- Advanced AI forecasting
- Sustainability reporting
- Real-time rerouting
- Complete POS integration

### Phase 3: Future Automation (Months 11-16)
- Automation APIs
- Full AI optimization

## System Integration Details

### POS Systems

| System | Key Feature |
|--------|-------------|
| Vectron | Bakery-specific APIs |
| KORONA POS | Sales + inventory sync |
| Lightspeed | Mobile flexibility |
| SumUp | Cost-effective |
| Square | Easy analytics |

### Inventory Tools

| Tool | Key Feature |
|------|-------------|
| OptiBack | German bakery standard |
| KORONA POS | Dual-purpose tool |
| FoodReady | Waste optimization |
| Craftybase | Material tracking |
| SOS Inventory | Lot management |
| StockTake Online | Multi-site support |

### Interface Overview

| Interface | Device | Key Function |
|-----------|--------|--------------|
| Loader | Tablet | Loading confirmation |
| Driver | Smartphone | Route navigation, sales entry |
| Manager Dashboard | Desktop | Fleet oversight, analytics |

## Additional Considerations

- **Sustainability**: Focus on waste (<5% unsold) and fuel (<10 L/100 km)
- **Future**: Possible customer app for pre-orders (Phase 4 consideration)
