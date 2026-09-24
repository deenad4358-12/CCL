import { useEffect, useMemo, useState } from 'react';

const priorityMinutes = {
  Urgent: 45,
  High: 120,
  Normal: 240,
};

const initialComplaints = [
  {
    id: 1,
    title: 'Lift stuck on 4th floor',
    resident: 'Asha Patil',
    building: 'Tower A',
    unit: 'A-402',
    category: 'Lift',
    priority: 'Urgent',
    status: 'Assigned',
    createdAt: Date.now() - 18 * 60 * 1000,
    updatedAt: Date.now() - 6 * 60 * 1000,
    assignedTo: 'Maintenance Team',
    notes: 'Residents are stuck and waiting for the technician.',
  },
  {
    id: 2,
    title: 'Water leakage near basement parking',
    resident: 'Ravi S.',
    building: 'Tower B',
    unit: 'B-112',
    category: 'Plumbing',
    priority: 'High',
    status: 'In Progress',
    createdAt: Date.now() - 56 * 60 * 1000,
    updatedAt: Date.now() - 22 * 60 * 1000,
    assignedTo: 'Plumbing Crew',
    notes: 'Leak is creating water buildup in the parking area.',
  },
  {
    id: 3,
    title: 'Security guard not present at gate',
    resident: 'Meera Nair',
    building: 'Wing C',
    unit: 'C-205',
    category: 'Security',
    priority: 'Normal',
    status: 'Submitted',
    createdAt: Date.now() - 70 * 60 * 1000,
    updatedAt: Date.now() - 33 * 60 * 1000,
    assignedTo: 'Security Desk',
    notes: 'Resident reported no guard at the main gate during evening.',
  },
];

const initialBills = [
  { id: 1, resident: 'Asha Patil', unit: 'A-402', amount: 3200, dueDate: '15 Sep 2026', status: 'Pending' },
  { id: 2, resident: 'Ravi S.', unit: 'B-112', amount: 2450, dueDate: '12 Sep 2026', status: 'Paid' },
  { id: 3, resident: 'Meera Nair', unit: 'C-205', amount: 4300, dueDate: '20 Sep 2026', status: 'Overdue' },
];

const initialPolls = [
  {
    id: 1,
    question: 'Do you want a rooftop solar lighting upgrade?',
    options: [
      { id: 'a', label: 'Yes, add rooftop lighting', votes: 62 },
      { id: 'b', label: 'No, keep current setup', votes: 31 },
      { id: 'c', label: 'Need more information', votes: 17 },
    ],
    closesAt: '2026-09-30',
  },
  {
    id: 2,
    question: 'Preferred renovation window for lobby interiors?',
    options: [
      { id: 'a', label: 'Weekend morning', votes: 54 },
      { id: 'b', label: 'Weekday evening', votes: 36 },
      { id: 'c', label: 'Any time', votes: 28 },
    ],
    closesAt: '2026-10-02',
  },
];

const cloudFeatures = [
  { label: 'Complaint Intake', value: 'AI NLP + Form Capture', accent: 'sky' },
  { label: 'SLA Automation', value: 'Event-based Escalation', accent: 'rose' },
  { label: 'Billing & Receipts', value: 'Secure Digital Invoice', accent: 'amber' },
  { label: 'Analytics', value: 'Heatmap + Charts', accent: 'emerald' },
  { label: 'Resident Voice', value: 'Community Polling', accent: 'violet' },
];

const statusOptions = ['Submitted', 'Assigned', 'In Progress', 'Resolved', 'Closed', 'Escalated'];

function classifyComplaint(text) {
  const lower = text.toLowerCase();

  if (/lift|elevator|stuck|door/.test(lower)) return 'Lift';
  if (/water|leak|plumbing|toilet|pipe|drain/.test(lower)) return 'Plumbing';
  if (/power|electric|light|switch|circuit|fan/.test(lower)) return 'Electrical';
  if (/gate|guard|security|entry|visitor|camera/.test(lower)) return 'Security';
  if (/clean|garbage|sweep|dust|washroom|stain/.test(lower)) return 'Cleaning';
  if (/parking|car|vehicle|wheel/.test(lower)) return 'Parking';
  return 'General Maintenance';
}

function getPriorityFromText(text) {
  const lower = text.toLowerCase();
  if (/urgent|danger|stuck|leak|fire|gas|safety|accident/.test(lower)) return 'Urgent';
  if (/high|major|broken|noisy|security|water/.test(lower)) return 'High';
  return 'Normal';
}

function formatTimeLeft(msLeft) {
  const totalMinutes = Math.max(0, Math.ceil(msLeft / 60000));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes} min`;
  return 'Due now';
}

function statusPill(status) {
  const map = {
    Submitted: 'status-submitted',
    Assigned: 'status-assigned',
    'In Progress': 'status-progress',
    Resolved: 'status-resolved',
    Closed: 'status-closed',
    Escalated: 'status-escalated',
    Overdue: 'status-overdue',
  };
  return map[status] || 'status-submitted';
}

function App() {
  const [view, setView] = useState('dashboard');
  const [complaints, setComplaints] = useState(() => {
    const saved = localStorage.getItem('ccl-complaints');
    return saved ? JSON.parse(saved) : initialComplaints;
  });
  const [bills, setBills] = useState(() => {
    const saved = localStorage.getItem('ccl-bills');
    return saved ? JSON.parse(saved) : initialBills;
  });
  const [polls, setPolls] = useState(() => {
    const saved = localStorage.getItem('ccl-polls');
    return saved ? JSON.parse(saved) : initialPolls;
  });
  const [form, setForm] = useState({
    resident: 'Asha Patil',
    building: 'Tower A',
    unit: 'A-402',
    complaint: 'Lift is stuck on the 4th floor with a loud screeching noise.',
  });

  useEffect(() => {
    localStorage.setItem('ccl-complaints', JSON.stringify(complaints));
  }, [complaints]);

  useEffect(() => {
    localStorage.setItem('ccl-bills', JSON.stringify(bills));
  }, [bills]);

  useEffect(() => {
    localStorage.setItem('ccl-polls', JSON.stringify(polls));
  }, [polls]);

  useEffect(() => {
    const interval = setInterval(() => {
      setComplaints((current) =>
        current.map((complaint) => {
          if (complaint.status === 'Closed' || complaint.status === 'Resolved') return complaint;

          const deadline = complaint.deadline || complaint.createdAt + priorityMinutes[complaint.priority] * 60 * 1000;
          const now = Date.now();
          const left = deadline - now;

          if (left <= 0 && complaint.status !== 'Escalated' && complaint.status !== 'Overdue') {
            return { ...complaint, status: 'Escalated', updatedAt: now };
          }

          return complaint;
        })
      );
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const analytics = useMemo(() => {
    const total = complaints.length;
    const open = complaints.filter((item) => !['Resolved', 'Closed'].includes(item.status)).length;
    const urgent = complaints.filter((item) => item.priority === 'Urgent').length;
    const categories = complaints.reduce((acc, item) => {
      acc[item.category] = (acc[item.category] || 0) + 1;
      return acc;
    }, {});

    const categoryEntries = Object.entries(categories).map(([label, count]) => ({ label, count }));
    const topCategory = categoryEntries.sort((a, b) => b.count - a.count)[0];

    return { total, open, urgent, categoryEntries, topCategory };
  }, [complaints]);

  const handleComplaintSubmit = (event) => {
    event.preventDefault();
    const trimmed = form.complaint.trim();
    if (!trimmed) return;

    const priority = getPriorityFromText(trimmed);
    const category = classifyComplaint(trimmed);
    const createdAt = Date.now();

    const complaint = {
      id: Date.now(),
      title: trimmed.split(' ').slice(0, 6).join(' ') + (trimmed.split(' ').length > 6 ? '...' : ''),
      resident: form.resident,
      building: form.building,
      unit: form.unit,
      category,
      priority,
      status: 'Submitted',
      createdAt,
      updatedAt: createdAt,
      deadline: createdAt + priorityMinutes[priority] * 60 * 1000,
      assignedTo: 'Operations Desk',
      notes: trimmed,
    };

    setComplaints((current) => [complaint, ...current]);
    setForm({
      resident: 'Asha Patil',
      building: 'Tower A',
      unit: 'A-402',
      complaint: '',
    });
    setView('dashboard');
  };

  const updateComplaintStatus = (id, nextStatus) => {
    setComplaints((current) =>
      current.map((item) =>
        item.id === id ? { ...item, status: nextStatus, updatedAt: Date.now() } : item
      )
    );
  };

  const payBill = (id) => {
    setBills((current) =>
      current.map((bill) =>
        bill.id === id ? { ...bill, status: 'Paid', dueDate: 'Paid Today' } : bill
      )
    );
  };

  const votePoll = (pollId, optionId) => {
    setPolls((current) =>
      current.map((poll) => {
        if (poll.id !== pollId) return poll;
        return {
          ...poll,
          options: poll.options.map((option) =>
            option.id === optionId ? { ...option, votes: option.votes + 1 } : option
          ),
        };
      })
    );
  };

  const totalRevenue = bills.reduce((sum, item) => sum + (item.status === 'Paid' ? item.amount : 0), 0);

  return (
    <div className="shell">
      <aside className="sidebar">
        <div className="brand-wrap">
          <div className="brand-mark">CCL</div>
          <div>
            <h1>Cloud Society</h1>
            <p>Command Center</p>
          </div>
        </div>

        <nav className="nav">
          <button className={view === 'dashboard' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('dashboard')}>
            Dashboard
          </button>
          <button className={view === 'complaints' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('complaints')}>
            Complaints
          </button>
          <button className={view === 'billing' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('billing')}>
            Payments
          </button>
          <button className={view === 'polls' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('polls')}>
            Community Polls
          </button>
          <button className={view === 'architecture' ? 'nav-btn active' : 'nav-btn'} onClick={() => setView('architecture')}>
            Cloud Architecture
          </button>
        </nav>

        <div className="sidebar-card">
          <span className="eyebrow">AI SLA Status</span>
          <strong>{analytics.urgent} urgent cases</strong>
          <p>{analytics.open} issues currently open</p>
        </div>
      </aside>

      <main className="main-panel">
        <header className="topbar">
          <div>
            <p className="eyebrow">AI-powered resident operations</p>
            <h2>Society management dashboard</h2>
          </div>
          <div className="avatar-group">
            <div className="avatar">SP</div>
            <div>
              <strong>Society Admin</strong>
              <small>Live overview</small>
            </div>
          </div>
        </header>

        {view === 'dashboard' && (
          <>
            <section className="stats-grid">
              <div className="stat-card accent-blue">
                <span>Total complaints</span>
                <strong>{analytics.total}</strong>
                <small>Across all units</small>
              </div>
              <div className="stat-card accent-amber">
                <span>Open issues</span>
                <strong>{analytics.open}</strong>
                <small>Requires action</small>
              </div>
              <div className="stat-card accent-rose">
                <span>Urgent SLA</span>
                <strong>{analytics.urgent}</strong>
                <small>Escalation monitor</small>
              </div>
              <div className="stat-card accent-green">
                <span>Collected revenue</span>
                <strong>₹{totalRevenue.toLocaleString('en-IN')}</strong>
                <small>Monthly receipts</small>
              </div>
            </section>

            <section className="content-grid two-col">
              <div className="panel">
                <div className="panel-header">
                  <h3>Submit a new complaint</h3>
                  <span className="chip success">AI classified</span>
                </div>

                <form onSubmit={handleComplaintSubmit} className="complaint-form">
                  <div className="field-row">
                    <label>
                      Resident
                      <input value={form.resident} onChange={(e) => setForm({ ...form, resident: e.target.value })} />
                    </label>
                    <label>
                      Building
                      <select value={form.building} onChange={(e) => setForm({ ...form, building: e.target.value })}>
                        <option>Tower A</option>
                        <option>Tower B</option>
                        <option>Wing C</option>
                        <option>Garden View</option>
                      </select>
                    </label>
                  </div>

                  <div className="field-row">
                    <label>
                      Unit
                      <input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
                    </label>
                    <label>
                      Priority
                      <select value={form.priority || 'High'} readOnly>
                        <option>High</option>
                        <option>Normal</option>
                        <option>Urgent</option>
                      </select>
                    </label>
                  </div>

                  <label>
                    Complaint description
                    <textarea
                      rows="4"
                      value={form.complaint}
                      onChange={(e) => setForm({ ...form, complaint: e.target.value })}
                      placeholder="Describe the issue..."
                    />
                  </label>

                  <button type="submit" className="primary-btn">Submit complaint</button>
                </form>
              </div>

              <div className="panel">
                <div className="panel-header">
                  <h3>Live complaint distribution</h3>
                  <span className="chip neutral">{analytics.topCategory?.label || 'General'}</span>
                </div>

                <div className="bars-list">
                  {analytics.categoryEntries.map(({ label, count }) => (
                    <div className="bar-row" key={label}>
                      <div className="bar-header">
                        <span>{label}</span>
                        <strong>{count}</strong>
                      </div>
                      <div className="bar-track">
                        <div className="bar-fill" style={{ width: `${(count / Math.max(analytics.total, 1)) * 100}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="panel full-width">
              <div className="panel-header">
                <h3>Live complaint queue</h3>
                <span className="chip neutral">Auto-updating SLA</span>
              </div>
              <div className="complaint-list">
                {complaints.map((complaint) => {
                  const deadline = complaint.deadline || complaint.createdAt + priorityMinutes[complaint.priority] * 60 * 1000;
                  const timeLeft = deadline - Date.now();
                  return (
                    <article className="complaint-card" key={complaint.id}>
                      <div className="card-top">
                        <div>
                          <h4>{complaint.title}</h4>
                          <p>
                            {complaint.resident} · {complaint.building} · {complaint.unit}
                          </p>
                        </div>
                        <span className={`pill ${statusPill(complaint.status)}`}>{complaint.status}</span>
                      </div>
                      <div className="card-meta">
                        <span>{complaint.category}</span>
                        <span>{complaint.priority}</span>
                        <span>{complaint.assignedTo}</span>
                      </div>
                      <div className="card-bottom">
                        <strong>{formatTimeLeft(timeLeft)}</strong>
                        <div className="status-actions">
                          {statusOptions.map((status) => (
                            <button
                              key={status}
                              type="button"
                              className={complaint.status === status ? 'mini-btn active' : 'mini-btn'}
                              onClick={() => updateComplaintStatus(complaint.id, status)}
                            >
                              {status}
                            </button>
                          ))}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {view === 'complaints' && (
          <section className="panel full-width">
            <div className="panel-header">
              <h3>Resident complaints board</h3>
              <span className="chip success">AI categorization active</span>
            </div>
            <div className="complaint-table">
              <div className="table-header row">
                <span>Resident</span>
                <span>Issue</span>
                <span>Category</span>
                <span>Priority</span>
                <span>Status</span>
              </div>
              {complaints.map((item) => (
                <div key={item.id} className="table-row row">
                  <span>{item.resident}</span>
                  <span>{item.title}</span>
                  <span>{item.category}</span>
                  <span>{item.priority}</span>
                  <span><span className={`pill ${statusPill(item.status)}`}>{item.status}</span></span>
                </div>
              ))}
            </div>
          </section>
        )}

        {view === 'billing' && (
          <section className="content-grid two-col">
            <div className="panel">
              <div className="panel-header">
                <h3>Maintenance billing</h3>
                <span className="chip neutral">₹{totalRevenue.toLocaleString('en-IN')} processed</span>
              </div>
              <div className="billing-list">
                {bills.map((bill) => (
                  <div key={bill.id} className="bill-card">
                    <div>
                      <strong>{bill.resident}</strong>
                      <p>{bill.unit}</p>
                    </div>
                    <div>
                      <span className="amount">₹{bill.amount.toLocaleString('en-IN')}</span>
                      <p>{bill.dueDate}</p>
                    </div>
                    <div className="bill-actions">
                      <span className={`pill ${bill.status === 'Pending' ? 'status-submitted' : bill.status === 'Paid' ? 'status-resolved' : 'status-overdue'}`}>
                        {bill.status}
                      </span>
                      {bill.status !== 'Paid' && (
                        <button type="button" className="primary-btn small" onClick={() => payBill(bill.id)}>
                          Pay now
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="panel">
              <div className="panel-header">
                <h3>Mock payment flow</h3>
                <span className="chip success">Secure gateway</span>
              </div>
              <div className="payment-box">
                <label>
                  Mode of payment
                  <select defaultValue="UPI">
                    <option>UPI</option>
                    <option>Credit Card</option>
                    <option>NetBanking</option>
                  </select>
                </label>
                <label>
                  Amount
                  <input value="₹3,200" readOnly />
                </label>
                <label>
                  Transaction hash
                  <input value="CCL-TRX-4839261" readOnly />
                </label>
                <button type="button" className="primary-btn">Generate receipt</button>
              </div>
            </div>
          </section>
        )}

        {view === 'polls' && (
          <section className="content-grid two-col">
            {polls.map((poll) => {
              const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
              return (
                <div key={poll.id} className="panel">
                  <div className="panel-header">
                    <h3>{poll.question}</h3>
                    <span className="chip neutral">Closes {poll.closesAt}</span>
                  </div>
                  <div className="poll-list">
                    {poll.options.map((option) => (
                      <button key={option.id} type="button" className="poll-option" onClick={() => votePoll(poll.id, option.id)}>
                        <div className="poll-topline">
                          <span>{option.label}</span>
                          <strong>{Math.round((option.votes / totalVotes) * 100) || 0}%</strong>
                        </div>
                        <div className="poll-bar-track">
                          <span style={{ width: `${(option.votes / totalVotes) * 100}%` }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        )}

        {view === 'architecture' && (
          <section className="panel full-width">
            <div className="panel-header">
              <h3>Cloud architecture viewer</h3>
              <span className="chip success">AWS / GCP / Azure mapping</span>
            </div>

            <div className="architecture-grid">
              <div className="arch-card">
                <h4>Resident Portal</h4>
                <p>Complaint intake, resident dashboard, payment intake</p>
                <div className="arch-stack">React + Vite UI</div>
              </div>
              <div className="arch-card">
                <h4>Serverless API Layer</h4>
                <p>Express / Lambda / Cloud Functions for complaint processing</p>
                <div className="arch-stack">API Gateway / Cloud Run / Azure Functions</div>
              </div>
              <div className="arch-card">
                <h4>AI Engine</h4>
                <p>Complaint categorization and urgency detection with fallback heuristics</p>
                <div className="arch-stack">Gemini / Bedrock / Vertex AI</div>
              </div>
              <div className="arch-card">
                <h4>Data & Storage</h4>
                <p>Persistent complaint ledger, bills, polls and receipts remain cloud-ready</p>
                <div className="arch-stack">DynamoDB / Firestore / Cosmos DB</div>
              </div>
              <div className="arch-card">
                <h4>SLA Workflow</h4>
                <p>Timers and escalations trigger alerts on missed deadlines</p>
                <div className="arch-stack">Step Functions / Cloud Tasks / Logic Apps</div>
              </div>
              <div className="arch-card">
                <h4>Analytics</h4>
                <p>Heatmaps, charts, admin reporting and resident insights</p>
                <div className="arch-stack">QuickSight / Looker / Power BI</div>
              </div>
            </div>

            <div className="feature-list">
              {cloudFeatures.map((feature) => (
                <div key={feature.label} className={`feature-pill ${feature.accent}`}>
                  <span>{feature.label}</span>
                  <strong>{feature.value}</strong>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
