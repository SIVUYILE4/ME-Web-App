# Commission Dashboard

A Python Flask web application for displaying commission data from SQL Server database.

## Features

- **Modern Web Interface**: Built with Flask, Bootstrap 5, and Chart.js
- **Database Integration**: Connects to SQL Server using Windows Authentication
- **Navigation System**: Four main sections (Home, Trends, Gross Commission, Net Commission)
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time Data**: Live connection to commission database
- **Interactive Charts**: Powered by Chart.js for data visualization
- **Error Handling**: Comprehensive error handling and user notifications

## Architecture

### Backend
- **Flask**: Web framework
- **pyodbc**: SQL Server connectivity with Windows Authentication
- **SQLAlchemy**: ORM for database operations
- **Jinja2**: Template engine

### Frontend
- **Bootstrap 5**: Responsive CSS framework
- **Chart.js**: Data visualization library
- **jQuery**: JavaScript library for DOM manipulation
- **Bootstrap Icons**: Icon library

### Database Connection
- **Server**: CL-JHB-SQL-01
- **Database**: Quill
- **Authentication**: Windows Authentication
- **Driver**: ODBC Driver 17 for SQL Server

## Project Structure

```
Web App 1.0/
├── app.py                    # Main Flask application
├── config.py                 # Configuration settings
├── requirements.txt          # Python dependencies
├── README.md                 # This file
├── models/
│   ├── __init__.py
│   └── database.py          # Database models and queries
├── routes/
│   ├── __init__.py
│   └── main.py              # Main application routes
├── templates/
│   ├── base.html            # Base template
│   ├── home.html            # Home page
│   ├── trends.html          # Trends page
│   ├── gross_commission.html # Gross Commission page
│   └── net_commission.html   # Net Commission page
└── static/
    ├── css/
    │   └── custom.css       # Custom styles
    └── js/
        └── dashboard.js     # Dashboard JavaScript
```

## Installation

### Prerequisites
- Python 3.8+
- SQL Server ODBC Driver 17
- Windows Authentication access to CL-JHB-SQL-01

### Setup Instructions

1. **Clone or download the project** to your local directory

2. **Create a virtual environment**:
   ```bash
   python -m venv venv
   venv\Scripts\activate
   ```

3. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Verify SQL Server connectivity**:
   - Ensure ODBC Driver 17 for SQL Server is installed
   - Test Windows Authentication access to the database

5. **Run the application**:
   ```bash
   python app.py
   ```

6. **Access the dashboard**:
   Open your web browser and navigate to `http://localhost:5000`

## Usage

### Navigation
- **Home**: Dashboard overview with summary statistics
- **Trends**: Time-based commission analysis (placeholder)
- **Gross Commission**: Gross commission details (placeholder)
- **Net Commission**: Net commission after deductions (placeholder)

### Features
- **Live Data**: Real-time connection to commission database
- **Auto-refresh**: Data automatically refreshes every 5 minutes
- **Export**: Export data to CSV format
- **Print**: Print dashboard pages
- **Keyboard Shortcuts**:
  - `Ctrl+R`: Refresh current page data
  - `Ctrl+E`: Export current page data
  - `Ctrl+P`: Print current page

### Database Query
The application executes a complex SQL query that retrieves commission data including:
- Commission amounts by period
- Product category breakdowns
- Personality type analysis
- Sales counts and metrics
- New business premiums

## Configuration

### Database Settings
Edit `config.py` to modify database connection settings:
```python
SQL_SERVER = 'CL-JHB-SQL-01'
DATABASE_NAME = 'Quill'
DRIVER = 'ODBC Driver 17 for SQL Server'
```

### Application Settings
- **Debug Mode**: Set `debug=True` in `app.py` for development
- **Port**: Default port is 5000, modify in `app.py` if needed
- **Host**: Default host is `0.0.0.0` for local network access

## API Endpoints

### Data Endpoints
- `GET /api/commission-data`: Returns raw commission data
- `GET /api/commission-summary`: Returns summary statistics

### Response Format
```json
{
  "status": "success",
  "data": [...],
  "summary": {
    "total_amount": 0,
    "total_new_business_premium": 0,
    "total_clients": 0,
    "total_products": 0,
    "product_categories_count": 0,
    "personality_types_count": 0,
    "total_records": 0
  }
}
```

## Security

### Authentication
- Uses Windows Authentication for database access
- No hardcoded credentials in the application
- Leverages existing corporate security infrastructure

### Data Protection
- SQL injection prevention through parameterized queries
- Input validation and sanitization
- Error handling prevents information disclosure

## Troubleshooting

### Common Issues

1. **Database Connection Error**:
   - Verify ODBC Driver 17 is installed
   - Check Windows Authentication permissions
   - Ensure SQL Server is accessible

2. **Application Won't Start**:
   - Check Python version compatibility
   - Verify all dependencies are installed
   - Check for port conflicts

3. **Data Not Loading**:
   - Verify database connection
   - Check SQL query syntax
   - Review browser console for JavaScript errors

### Logs
- Application logs are displayed in the console
- Database errors are logged to console
- JavaScript errors appear in browser developer tools

## Development

### Adding New Features
1. Add routes in `routes/main.py`
2. Create templates in `templates/` directory
3. Add JavaScript functions in `static/js/dashboard.js`
4. Style with custom CSS in `static/css/custom.css`

### Database Modifications
- Update SQL queries in `models/database.py`
- Test queries in SQL Server Management Studio first
- Handle new fields in API responses

### Frontend Development
- Use Bootstrap 5 components for consistency
- Follow existing naming conventions
- Ensure responsive design principles

## Support

For technical support or questions:
1. Check the troubleshooting section above
2. Review application logs for error details
3. Verify database connectivity and permissions

## License

This project is proprietary and intended for internal use only.