import React from 'react';
import { mockBackend } from '../../services/mockBackend';
import { CheckCircle, XCircle } from 'lucide-react';
import CustomDropdown from '../layout/CustomDropdown';
import './Attendance.css';

const Attendance = () => {
    const { attendance } = mockBackend;
    const [curriculum, setCurriculum] = React.useState('');
    const [term, setTerm] = React.useState('');
    const [searchTerm, setSearchTerm] = React.useState('');
    const [entriesPerPage, setEntriesPerPage] = React.useState('10');
    const [currentPage, setCurrentPage] = React.useState(1);

    // Filtering and Pagination Logic
    const filteredDaywise = (attendance.daywise || []).filter(item => 
        item.course.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.date.includes(searchTerm)
    );

    const totalEntries = filteredDaywise.length;
    const itemsPerPage = parseInt(entriesPerPage);
    const totalPages = Math.ceil(totalEntries / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentEntries = filteredDaywise.slice(startIdx, startIdx + itemsPerPage);

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1); // Reset to first page on search
    };

    const handleEntriesChange = (val) => {
        setEntriesPerPage(val);
        setCurrentPage(1);
    };

    // Helper to calculate status
    const getPrediction = (present, total) => {
        const percentage = (present / total) * 100;
        if (percentage < 75) {
            const needed = Math.ceil((0.75 * total - present) / 0.25);
            return {
                status: 'critical',
                message: `You need to attend ${needed} more classes to reach 75%.`,
                classesToMiss: 0
            };
        } else {
            const canMiss = Math.floor((present - 0.75 * total) / 0.75);
            return {
                status: 'safe',
                message: `You are safe! You can skip up to ${canMiss} classes and still stay above 75%.`,
                classesToMiss: canMiss
            };
        }
    };

    const months = [
        'January', 'February', 'March', 'April', 'May', 'June', 
        'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const [fromMonth, setFromMonth] = React.useState('');
    const [toMonth, setToMonth] = React.useState('');

    return (
        <div className="attendance-container">
            {/* Main Title Banner (Brutalist style from screenshot) */}
            <div className="yellow-title-box animate-enter">
                <h1>ATTENDANCE LIST</h1>
            </div>

            {/* Filters */}
            <div className="filters-section">
                <div className="filter-group">
                    <CustomDropdown 
                        label="Curriculum *"
                        options={attendance.curriculums || []}
                        value={curriculum}
                        onChange={setCurriculum}
                        placeholder="Select Curriculum"
                    />
                </div>
                <div className="filter-group">
                    <CustomDropdown 
                        label="Term *"
                        options={attendance.terms || []}
                        value={term}
                        onChange={setTerm}
                        placeholder="Select Term"
                    />
                </div>
                <div className="filter-group">
                    <CustomDropdown 
                        label="From Month *"
                        options={months}
                        value={fromMonth}
                        onChange={setFromMonth}
                        placeholder="Select Month"
                    />
                </div>
                <div className="filter-group">
                    <CustomDropdown 
                        label="To Month *"
                        options={months}
                        value={toMonth}
                        onChange={setToMonth}
                        placeholder="Select Month"
                    />
                </div>
            </div>

            {/* Course Summary */}
            <div className="summary-section">
                <div className="section-title">Course summary list</div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '50%' }}>Course</th>
                            <th>Present / Total class</th>
                            <th>Total percentage(%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {attendance.courseSummary?.map((item, index) => (
                            <tr key={index}>
                                <td>{item.course}</td>
                                <td>{item.present} / {item.total}</td>
                                <td>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <div style={{
                                            flex: 1,
                                            height: '8px',
                                            background: '#333',
                                            borderRadius: '4px',
                                            maxWidth: '250px',
                                            overflow: 'hidden'
                                        }}>
                                            <div style={{
                                                width: `${item.percentage}%`,
                                                height: '100%',
                                                background: item.percentage >= 75 ? '#4ade80' : '#f87171',
                                                borderRadius: '4px'
                                            }} />
                                        </div>
                                        <span style={{ fontWeight: 800, color: item.percentage >= 75 ? '#4ade80' : '#f87171' }}>
                                            {item.percentage}%
                                        </span>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Daywise List */}
            <div className="daywise-section">
                <div className="table-controls">
                    <div className="entries-select" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        Show 
                        <div style={{ width: '100px' }}>
                            <CustomDropdown 
                                options={['5', '10', '25', '50', '100']}
                                value={entriesPerPage}
                                onChange={handleEntriesChange}
                                placeholder={entriesPerPage}
                            />
                        </div>
                        entries
                    </div>
                    <div className="daywise-title">Daywise course list</div>
                    <div className="search-box">
                        Search: <input 
                            type="text" 
                            value={searchTerm}
                            onChange={handleSearch}
                            placeholder="Type to search..."
                        />
                    </div>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ width: '40%' }}>Course</th>
                            <th>Class Date</th>
                            <th>Attendance</th>
                            <th>Document status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEntries.length > 0 ? (
                            currentEntries.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.course}</td>
                                    <td>{item.date}</td>
                                    <td>
                                        <span className={`status-badge ${item.status.toLowerCase()}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="doc-status">{item.docStatus}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                                    No matching records found
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="table-footer">
                    <span>
                        Showing {totalEntries > 0 ? startIdx + 1 : 0} to {Math.min(startIdx + itemsPerPage, totalEntries)} of {totalEntries} entries
                    </span>
                    <div className="pagination">
                        <button 
                            className="pg-btn"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        >
                            Previous
                        </button>
                        <span className="page-num">{currentPage}</span>
                        <button 
                            className="pg-btn"
                            disabled={currentPage === totalPages || totalPages === 0}
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Attendance;
