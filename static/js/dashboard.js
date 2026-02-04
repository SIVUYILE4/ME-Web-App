// Commission Dashboard JavaScript

// Global variables
let isDataLoading = false;

// Utility functions
function showLoading() {
    isDataLoading = true;
    $('#loading-overlay').removeClass('d-none');
}

function hideLoading() {
    isDataLoading = false;
    $('#loading-overlay').addClass('d-none');
}

function showNotification(message, type = 'info') {
    const alertClass = type === 'error' ? 'alert-danger' : 
                      type === 'success' ? 'alert-success' : 
                      type === 'warning' ? 'alert-warning' : 'alert-info';
    
    const icon = type === 'error' ? 'bi-exclamation-triangle' : 
                 type === 'success' ? 'bi-check-circle' : 
                 type === 'warning' ? 'bi-exclamation-triangle' : 'bi-info-circle';
    
    const notification = $(`
        <div class="alert ${alertClass} alert-dismissible fade show notification" role="alert">
            <i class="bi ${icon}"></i> ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `);
    
    $('body').append(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.fadeOut(300, function() {
            $(this).remove();
        });
    }, 5000);
}

function updateConnectionStatus(isConnected) {
    const statusElement = $('#connection-status');
    
    if (isConnected) {
        statusElement.removeClass('bg-danger').addClass('bg-success');
        statusElement.html('<i class="bi bi-database"></i> Connected');
    } else {
        statusElement.removeClass('bg-success').addClass('bg-danger');
        statusElement.html('<i class="bi bi-database-x"></i> Disconnected');
    }
}

function formatCurrency(amount) {
    if (amount === null || amount === undefined) return 'R0.00';
    return 'R' + parseFloat(amount).toLocaleString('en-ZA', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function formatNumber(number) {
    if (number === null || number === undefined) return '0';
    return parseFloat(number).toLocaleString('en-ZA');
}

function formatPercentage(value) {
    if (value === null || value === undefined) return '0%';
    return parseFloat(value).toLocaleString('en-ZA', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1
    });
}

// API functions
async function apiCall(url, options = {}) {
    try {
        showLoading();
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        updateConnectionStatus(true);
        return data;
        
    } catch (error) {
        console.error('API call failed:', error);
        updateConnectionStatus(false);
        showNotification('Connection error: ' + error.message, 'error');
        throw error;
    } finally {
        hideLoading();
    }
}

// Chart configuration defaults
const chartDefaults = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            position: 'top',
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += formatCurrency(context.parsed.y);
                    }
                    return label;
                }
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            ticks: {
                callback: function(value) {
                    return formatCurrency(value);
                }
            }
        }
    }
};

// Initialize dashboard when document is ready
$(document).ready(function() {
    // Initialize tooltips
    $('[data-bs-toggle="tooltip"]').tooltip();
    
    // Initialize popovers
    $('[data-bs-toggle="popover"]').popover();
    
    // Set up periodic connection check
    setInterval(checkConnection, 30000); // Check every 30 seconds
    
    // Add smooth scrolling to anchor links
    $('a[href^="#"]').on('click', function(event) {
        var target = $(this.getAttribute('href'));
        if (target.length) {
            event.preventDefault();
            $('html, body').stop().animate({
                scrollTop: target.offset().top - 70
            }, 1000);
        }
    });
    
    // Auto-refresh data every 5 minutes
    setInterval(() => {
        if (!isDataLoading && $('.page-content').length > 0) {
            refreshCurrentPage();
        }
    }, 300000); // 5 minutes
});

function checkConnection() {
    fetch('/api/commission-summary')
        .then(response => {
            if (response.ok) {
                updateConnectionStatus(true);
            } else {
                updateConnectionStatus(false);
            }
        })
        .catch(() => {
            updateConnectionStatus(false);
        });
}

function refreshCurrentPage() {
    // Get current page path
    const currentPath = window.location.pathname;
    
    if (currentPath === '/' || currentPath === '/home') {
        if (typeof loadSummaryData === 'function') {
            loadSummaryData();
        }
    } else if (currentPath === '/trends') {
        if (typeof loadTrendsData === 'function') {
            loadTrendsData();
        }
    } else if (currentPath === '/gross-commission') {
        if (typeof loadGrossCommissionData === 'function') {
            loadGrossCommissionData();
        }
    } else if (currentPath === '/net-commission') {
        if (typeof loadNetCommissionData === 'function') {
            loadNetCommissionData();
        }
    }
}

// Export data functions
function exportToCSV(data, filename = 'data.csv') {
    if (!data || data.length === 0) {
        showNotification('No data to export', 'warning');
        return;
    }
    
    // Get headers from first object
    const headers = Object.keys(data[0]);
    
    // Create CSV content
    const csvContent = [
        headers.join(','),
        ...data.map(row => 
            headers.map(header => {
                const value = row[header];
                // Handle values that might contain commas
                if (typeof value === 'string' && value.includes(',')) {
                    return `"${value}"`;
                }
                return value || '';
            }).join(',')
        )
    ].join('\n');
    
    // Create download link
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    showNotification('Data exported successfully', 'success');
}

// Print function
function printPage() {
    window.print();
}

// Keyboard shortcuts
$(document).keydown(function(e) {
    // Ctrl+R or F5: Refresh data
    if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault();
        refreshCurrentPage();
    }
    
    // Ctrl+E: Export data
    if (e.ctrlKey && e.key === 'e') {
        e.preventDefault();
        // Trigger export if on a data page
        if (typeof exportCurrentPageData === 'function') {
            exportCurrentPageData();
        }
    }
    
    // Ctrl+P: Print
    if (e.ctrlKey && e.key === 'p') {
        e.preventDefault();
        printPage();
    }
});

// Error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    showNotification('An unexpected error occurred', 'error');
});

// Global error handler
window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });
    showNotification('An error occurred: ' + message, 'error');
    return false;
};