# Implementation Plan - AI-Powered Cloud Society Management & Complaint SLA System (CCL CIA)

## Project Overview
This project is an **AI-Driven Cloud-Based Society Management & Complaint Resolution System** designed for a Cloud Computing Lab CIA submission. It leverages Cloud Native Services (Serverless Backend, Cloud AI APIs, Managed NoSQL DB, Storage, Scheduled Functions/Tasks, and Cloud Analytics) alongside a high-performance modern web interface for Residents and Admins/Secretaries.

---

## ☁️ Cloud Architecture & Cloud Services Mapping

For the Cloud Computing Lab CIA evaluation, the architecture maps directly to industry-standard Cloud Service Providers (**AWS / GCP / Azure**):

| Feature | AWS Implementation | GCP Alternative | Azure Alternative | Implementation in Prototype |
| :--- | :--- | :--- | :--- | :--- |
| **AI Complaint Categorization & Urgency** | AWS Bedrock / Amazon Comprehend | Google Vertex AI / Gemini API | Azure OpenAI / Text Analytics | Gemini AI API / NLP Engine fallback |
| **Database & Live SLA State** | AWS DynamoDB (Streams) | Cloud Firestore | Azure Cosmos DB | Cloud-ready LocalStorage / IndexedDB + API Mock |
| **SLA Timer & Auto-Escalation** | AWS Step Functions + EventBridge | GCP Cloud Tasks + Cloud Scheduler | Azure Logic Apps | Web Workers / Cloud Timer simulation + Notification trigger |
| **Receipt & File Storage** | AWS S3 Bucket | Google Cloud Storage | Azure Blob Storage | S3-Compatible Blob URL / PDF Generator |
| **Serverless API Backend** | AWS Lambda + API Gateway | Cloud Functions / Cloud Run | Azure Functions | Express / Vite Node API Endpoints |
| **Analytics & Heatmap Engine** | AWS QuickSight / CloudWatch | GCP BigQuery / Looker | Azure Synapse / Power BI | Recharts / Chart.js Interactive Dashboard |

---

## Key Features to Implement

### 1. 🤖 AI-Based Complaint Categorization & Priority Engine
- **Input**: Resident types natural language complaint (e.g., *"Lift is stuck on the 4th floor with noise"* or *"Water leaking in B-302 bathroom"*).
- **AI Processing**: Zero-shot NLP extracts **Category** (`Lift`, `Plumbing`, `Electrical`, `Security`, `Cleaning`, `Parking`, etc.), **Priority** (`🔴 Urgent`, `🟠 High`, `🟢 Normal`), and **Estimated SLA Duration** (e.g., 2 hrs for Urgent, 24 hrs for Normal).
- **Fallback**: Robust regex/keyword heuristic tagger if cloud API key is offline.

### 2. ⏱️ Live Complaint Tracking & SLA Timer with Escalation
- **Workflow**: `Submitted` ➔ `Assigned` ➔ `In Progress` ➔ `Resolved` ➔ `Closed`.
- **SLA Countdown**: Live ticking countdown timer based on priority.
- **Auto-Escalation**: When SLA countdown hits zero without resolution, state automatically updates to **`OVERDUE - ESCALATED TO SECRETARY`** with visual alert badges and notification logs.

### 3. 💳 Maintenance Payment & Digital Receipt System
- **Billing Table**: View current/past bills with status (`Paid`, `Pending`, `Overdue`).
- **Payment Gateway Simulation**: One-click mock checkout flow (Credit Card / UPI / NetBanking).
- **Digital Receipt Generator**: Instant creation of printable digital tax invoice receipt with transaction hash, timestamp, and downloadable PDF/Image view.

### 4. 📊 Society Issue Heatmap & Analytics Dashboard (Admin View)
- **Visual Metrics**: Category distribution (Pie/Bar charts), Building/Block-wise issue breakdown, Average SLA resolution rate.
- **Interactive Heatmap Grid**: Floor-by-floor visual grid representing active/past complaints per building wing (e.g., Tower A, Tower B, Wing C).

### 5. 🗳️ Community Polls & Voting System
- **Admin Control**: Create polls with options and closing dates.
- **Resident Security**: Voting restricted to verified resident profiles, preventing duplicate votes.
- **Live Results Bar**: Dynamic progress bars displaying real-time vote percentage breakdown.

---

## 🏛️ Project Directory Structure (Proposed)

```
ccl cia/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx
│   ├── index.css
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── Sidebar.jsx
│   │   ├── ComplaintCard.jsx
│   │   ├── SLATimer.jsx
│   │   ├── PaymentReceiptModal.jsx
│   │   └── CloudArchDiagramModal.jsx
│   ├── pages/
│   │   ├── ResidentDashboard.jsx
│   │   ├── NewComplaint.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── MaintenanceBills.jsx
│   │   ├── AnalyticsHeatmap.jsx
│   │   └── CommunityPolls.jsx
│   ├── services/
│   │   ├── aiCategorizer.js      # Cloud AI API Integration (Gemini / AWS Bedrock bridge)
│   │   ├── cloudStorage.js        # S3 / Mock Cloud DB layer
│   │   └── mockData.js            # Initial seed data for complaints, bills, polls
│   └── utils/
│       ├── slaCalculator.js       # SLA deadlines calculation
│       └── pdfReceiptGenerator.js # Invoice digital receipt builder
```

---

## 💡 User Review Required

> [!IMPORTANT]
> 1. **Cloud Architecture Focus**: Since this is for a **Cloud Computing Lab CIA**, we will include a built-in interactive **Cloud Architecture Viewer** tab inside the web app. This will visually explain the AWS/GCP/Azure serverless setup to your lab evaluator/professor!
> 2. **AI Categorization Provider**: Would you like to use Google's Gemini API (free tier API key) or rely on a built-in Cloud AI NLP classification model running locally in JS for offline submission reliability?

---

## ❓ Open Questions

> [!NOTE]
> - Do you have a preference for AWS vs. GCP vs. Azure terminology in your CIA project presentation/report? (Defaulting to AWS Serverless: Lambda + DynamoDB + Bedrock/Gemini + S3 + EventBridge).

---

## 🧪 Verification Plan

### Automated & Manual Verification
1. **AI Categorization**: Test prompts like "Lift stuck on 4th floor", "Water leak in parking basement", "Guard absent at gate", verify correct auto-classification and priority assignment.
2. **SLA Countdown & Escalation**: Create urgent complaint with short SLA (e.g. 1 minute for testing), observe live timer ticking and auto-escalation trigger when timer hits zero.
3. **Maintenance & Receipt**: Complete mock payment, verify digital receipt generation with unique payment ID and download capability.
4. **Analytics & Heatmap**: Verify complaint counts dynamically recalculate across charts when new complaints are submitted.
5. **Community Polls**: Test casting a vote as a verified resident, verify single-vote constraint enforcement and real-time chart update.
