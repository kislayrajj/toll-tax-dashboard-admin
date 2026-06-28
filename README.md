# Smart Toll Tax System — Admin Dashboard

> React-based operator dashboard for managing vehicles, BLE devices, toll transactions, and dispute resolution. Part of a published research project replacing India's FASTag with a BLE-based toll system.

[![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

**[Live Demo →](https://toll-tax-dashboard-admin.vercel.app)**

---

## What This Dashboard Does

This is the operator-facing interface for toll plaza managers. It connects to the [toll-tax-server](https://github.com/kislayrajj/toll-tax-server) and provides real-time visibility and control over the entire toll collection system.

---

## Screens

### Overview
Live counts of registered vehicles, active toll gates, and linked BLE devices.

### Vehicle Management
- Register new vehicles with plate number, owner details, and home address (GPS coordinates)
- Home address is used by the server for automatic **hometown exemption** — vehicles within 20km of a toll gate are exempt without any manual intervention
- Delete vehicles (automatically unlinks the associated BLE device)

### Device Management
- Activate or deactivate a vehicle's BLE tag remotely
- Deactivated tags are flagged by the server during toll processing — no charge issued, incident logged

### Transactions
- Full searchable log of every toll event across all gates
- Each record shows: vehicle ID, gate, amount, timestamp, result (paid / exempt / flagged), and dispute status

### Disputes
- Queue of all unresolved disputes submitted by vehicle owners
- Click any dispute to see the original transaction details in a side panel
- Resolve or deny with admin notes — decision is saved and visible to the vehicle owner immediately

---

## Tech Stack

| | |
|---|---|
| Framework | React.js (Vite) |
| Styling | Tailwind CSS |
| Data Fetching | TanStack React Query (auto-refresh, cache management) |
| Auth | JWT (admin role only) |
| Deployment | Vercel |
| API | [toll-tax-server](https://github.com/kislayrajj/toll-tax-server) |

TanStack React Query handles automatic data refresh without manual page reloads — dashboards stay current as new toll events come in from the hardware scanners.

---

## Local Setup

```bash
git clone https://github.com/kislayrajj/toll-tax-dashboard-admin.git
cd toll-tax-dashboard-admin
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:5000
```

```bash
npm run dev
```

> The admin dashboard requires the [backend server](https://github.com/kislayrajj/toll-tax-server) to be running.

---

## System Overview

This dashboard is one part of a three-component system:

```
[ESP32 BLE Scanner] → [Node.js Server] → [Admin Dashboard]  ← you are here
                                        → [User Dashboard]
```

The ESP32 hardware scanner at the toll gate detects vehicles via Bluetooth Low Energy, sends the vehicle ID to the server, and the server runs a 5-scenario decision engine (average 842ms). This dashboard gives operators full visibility and control over that process.

## Related Repositories

| Repo | Description |
|------|-------------|
| [toll-tax-server](https://github.com/kislayrajj/toll-tax-server) | Node.js / Express / MongoDB backend |
| [toll-tax-dashboard-user](https://github.com/kislayrajj/toll-tax-dashboard-user) | Vehicle owner portal |

## Research

**"Smart Toll Tax System Using Bluetooth Low Energy and a Cloud-Based Web Application"**
— Kislay Raj, Chandigarh University · 94.3% lane accuracy · 842ms avg processing time

---

## Author

**Kislay Raj** — [LinkedIn](https://www.linkedin.com/in/kislay-raj-b462502a6/) · [Portfolio](https://portfolio-w-react.vercel.app/) · [GitHub](https://github.com/kislayrajj)
