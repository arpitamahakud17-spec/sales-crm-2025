import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { leadAPI, contactAPI, dealAPI } from '../services/api';

function Dashboard() {
  const [activeTab, setActiveTab] = useState('leads');
  const [leads, setLeads] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [deals, setDeals] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({});
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    try {
      if (activeTab === 'leads') {
        const res = await leadAPI.getAll();
        setLeads(res.data);
      } else if (activeTab === 'contacts') {
        const res = await contactAPI.getAll();
        setContacts(res.data);
      } else if (activeTab === 'deals') {
        const res = await dealAPI.getAll();
        setDeals(res.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'leads') {
        if (editingId) {
          await leadAPI.update(editingId, formData);
        } else {
          await leadAPI.create(formData);
        }
      } else if (activeTab === 'contacts') {
        if (editingId) {
          await contactAPI.update(editingId, formData);
        } else {
          await contactAPI.create(formData);
        }
      } else if (activeTab === 'deals') {
        if (editingId) {
          await dealAPI.update(editingId, formData);
        } else {
          await dealAPI.create(formData);
        }
      }
      setShowForm(false);
      setFormData({});
      setEditingId(null);
      fetchData();
    } catch (err) {
      alert('Error: ' + (err.response?.data?.message || 'Something went wrong'));
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      if (activeTab === 'leads') await leadAPI.delete(id);
      else if (activeTab === 'contacts') await contactAPI.delete(id);
      else if (activeTab === 'deals') await dealAPI.delete(id);
      fetchData();
    } catch (err) {
      alert('Error deleting');
    }
  };

  const handleEdit = (item) => {
    setFormData(item);
    setEditingId(item._id);
    setShowForm(true);
  };

  const renderTable = () => {
    let data = activeTab === 'leads' ? leads : activeTab === 'contacts' ? contacts : deals;
    
    return (
      <table style={styles.table}>
        <thead>
          <tr>
            {activeTab === 'leads' && <><th>Name</th><th>Email</th><th>Phone</th><th>Status</th></>}
            {activeTab === 'contacts' && <><th>Name</th><th>Email</th><th>Phone</th><th>Company</th></>}
            {activeTab === 'deals' && <><th>Title</th><th>Value</th><th>Stage</th><th>Close Date</th></>}
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              {activeTab === 'leads' && <><td>{item.name}</td><td>{item.email}</td><td>{item.phone}</td><td><span style={getStatusBadge(item.status)}>{item.status}</span></td></>}
              {activeTab === 'contacts' && <><td>{item.name}</td><td>{item.email}</td><td>{item.phone}</td><td>{item.company}</td></>}
              {activeTab === 'deals' && <><td>{item.title}</td><td>₹{item.value}</td><td><span style={getStatusBadge(item.stage)}>{item.stage}</span></td><td>{item.closeDate ? new Date(item.closeDate).toLocaleDateString() : '-'}</td></>}
              <td>
                <button onClick={() => handleEdit(item)} style={styles.editBtn}>Edit</button>
                <button onClick={() => handleDelete(item._id)} style={styles.deleteBtn}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  const renderForm = () => {
    return (
      <div style={styles.modal}>
        <div style={styles.modalContent}>
          <h3>{editingId ? 'Edit' : 'Add'} {activeTab.slice(0, -1)}</h3>
          <form onSubmit={handleSubmit} style={styles.form}>
            {activeTab === 'leads' && (
              <>
                <input placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={styles.input} />
                <input placeholder="Email" type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={styles.input} />
                <input placeholder="Phone" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} required style={styles.input} />
                <input placeholder="Company" value={formData.company || ''} onChange={(e) => setFormData({...formData, company: e.target.value})} style={styles.input} />
                <select value={formData.status || 'New'} onChange={(e) => setFormData({...formData, status: e.target.value})} style={styles.input}>
                  <option>New</option><option>Contacted</option><option>Qualified</option><option>Lost</option>
                </select>
              </>
            )}
            {activeTab === 'contacts' && (
              <>
                <input placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({...formData, name: e.target.value})} required style={styles.input} />
                <input placeholder="Email" type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value})} required style={styles.input} />
                <input placeholder="Phone" value={formData.phone || ''} onChange={(e) => setFormData({...formData, phone: e.target.value})} required style={styles.input} />
                <input placeholder="Company" value={formData.company || ''} onChange={(e) => setFormData({...formData, company: e.target.value})} style={styles.input} />
                <input placeholder="Position" value={formData.position || ''} onChange={(e) => setFormData({...formData, position: e.target.value})} style={styles.input} />
              </>
            )}
            {activeTab === 'deals' && (
              <>
                <input placeholder="Title" value={formData.title || ''} onChange={(e) => setFormData({...formData, title: e.target.value})} required style={styles.input} />
                <input placeholder="Value" type="number" value={formData.value || ''} onChange={(e) => setFormData({...formData, value: e.target.value})} required style={styles.input} />
                <select value={formData.stage || 'New'} onChange={(e) => setFormData({...formData, stage: e.target.value})} style={styles.input}>
                  <option>New</option><option>In Progress</option><option>Won</option><option>Lost</option>
                </select>
                <input placeholder="Close Date" type="date" value={formData.closeDate ? formData.closeDate.split('T')[0] : ''} onChange={(e) => setFormData({...formData, closeDate: e.target.value})} style={styles.input} />
              </>
            )}
            <div style={{display: 'flex', gap: '10px'}}>
              <button type="submit" style={styles.submitBtn}>Save</button>
              <button type="button" onClick={() => {setShowForm(false); setFormData({}); setEditingId(null);}} style={styles.cancelBtn}>Cancel</button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const getStatusBadge = (status) => {
    const colors = {
      'New': '#3b82f6', 'Contacted': '#f59e0b', 'Qualified': '#10b981', 'Lost': '#ef4444',
      'In Progress': '#f59e0b', 'Won': '#10b981'
    };
    return { background: colors[status] || '#6b7280', color: 'white', padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' };
  };

  return (
    <div>
      <nav style={styles.nav}>
        <h2>Sales CRM Dashboard</h2>
        <button onClick={handleLogout} style={styles.logoutBtn}>Logout</button>
      </nav>
      
      <div className="container">
        <div style={styles.tabs}>
          <button onClick={() => setActiveTab('leads')} style={activeTab === 'leads' ? {...styles.tab, ...styles.activeTab} : styles.tab}>Leads</button>
          <button onClick={() => setActiveTab('contacts')} style={activeTab === 'contacts' ? {...styles.tab, ...styles.activeTab} : styles.tab}>Contacts</button>
          <button onClick={() => setActiveTab('deals')} style={activeTab === 'deals' ? {...styles.tab, ...styles.activeTab} : styles.tab}>Deals</button>
        </div>
        
        <div style={styles.header}>
          <h3 style={{textTransform: 'capitalize'}}>{activeTab}</h3>
          <button onClick={() => setShowForm(true)} style={styles.addBtn}>+ Add {activeTab.slice(0, -1)}</button>
        </div>
        
        {renderTable()}
        {showForm && renderForm()}
      </div>
    </div>
  );
}

const styles = {
  nav: { background: '#667eea', color: 'white', padding: '15px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logoutBtn: { background: 'white', color: '#667eea', border: 'none', padding: '8px 16px', borderRadius: '5px', fontWeight: 'bold' },
  tabs: { display: 'flex', gap: '10px', marginTop: '20px', marginBottom: '20px' },
  tab: { padding: '10px 20px', border: 'none', background: 'white', borderRadius: '5px', cursor: 'pointer' },
  activeTab: { background: '#667eea', color: 'white', fontWeight: 'bold' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  addBtn: { background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', fontWeight: 'bold' },
  table: { width: '100%', background: 'white', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' },
  editBtn: { background: '#3b82f6', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px', marginRight: '5px' },
  deleteBtn: { background: '#ef4444', color: 'white', border: 'none', padding: '5px 12px', borderRadius: '4px' },
  modal: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' },
  modalContent: { background: 'white', padding: '30px', borderRadius: '10px', width: '90%', maxWidth: '500px' },
  form: { display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '20px' },
  input: { padding: '10px', border: '1px solid #ddd', borderRadius: '5px' },
  submitBtn: { background: '#10b981', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold' },
  cancelBtn: { background: '#6b7280', color: 'white', border: 'none', padding: '10px', borderRadius: '5px', fontWeight: 'bold' },
};

export default Dashboard;