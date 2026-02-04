from flask import Blueprint, render_template, jsonify
from models.database import CommissionData

main_bp = Blueprint('main', __name__)

@main_bp.route('/')
def home():
    """Home page - Dashboard overview"""
    return render_template('home.html', title='Home - Commission Dashboard')

@main_bp.route('/trends')
def trends():
    """Trends page - Time-based analysis"""
    return render_template('trends.html', title='Trends - Commission Dashboard')

@main_bp.route('/gross-commission')
def gross_commission():
    """Gross Commission page"""
    return render_template('gross_commission.html', title='Gross Commission - Commission Dashboard')

@main_bp.route('/net-commission')
def net_commission():
    """Net Commission page"""
    return render_template('net_commission.html', title='Net Commission - Commission Dashboard')

@main_bp.route('/api/commission-data')
def api_commission_data():
    """API endpoint to get commission data"""
    try:
        data = CommissionData.get_commission_data()
        if data is not None:
            return jsonify({
                'status': 'success',
                'data': data,
                'count': len(data)
            })
        else:
            return jsonify({
                'status': 'error',
                'message': 'Failed to retrieve commission data'
            }), 500
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500

@main_bp.route('/api/commission-summary')
def api_commission_summary():
    """API endpoint to get commission summary statistics"""
    try:
        data = CommissionData.get_commission_data()
        if data is None:
            return jsonify({
                'status': 'error',
                'message': 'Failed to retrieve commission data'
            }), 500
        
        # Calculate summary statistics
        total_amount = sum(item['Amount'] for item in data if item['Amount'] is not None)
        total_new_business = sum(item['NewBusinessMonthlyPremium'] for item in data if item['NewBusinessMonthlyPremium'] is not None)
        total_clients = sum(item['SalesCount_Client'] for item in data if item['SalesCount_Client'] is not None)
        total_products = sum(item['SalesCount_Product'] for item in data if item['SalesCount_Product'] is not None)
        
        # Get unique product categories
        product_categories = list(set(item['ProductCategoryDescription'] for item in data if item['ProductCategoryDescription']))
        
        # Get unique personality types
        personality_types = list(set(item['Personality_To_Use'] for item in data if item['Personality_To_Use']))
        
        summary = {
            'total_amount': total_amount,
            'total_new_business_premium': total_new_business,
            'total_clients': total_clients,
            'total_products': total_products,
            'product_categories_count': len(product_categories),
            'personality_types_count': len(personality_types),
            'total_records': len(data)
        }
        
        return jsonify({
            'status': 'success',
            'summary': summary
        })
        
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': str(e)
        }), 500