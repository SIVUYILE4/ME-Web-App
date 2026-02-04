import os

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key-change-in-production'
    
    # SQL Server Configuration
    SQL_SERVER = 'CL-JHB-SQL-01'
    DATABASE_NAME = 'Quill'
    DRIVER = 'ODBC Driver 17 for SQL Server'
    
    # Connection string for Windows Authentication
    CONNECTION_STRING = f'DRIVER={{{DRIVER}}};SERVER={SQL_SERVER};DATABASE={DATABASE_NAME};Trusted_Connection=yes;'
    
    SQLALCHEMY_DATABASE_URI = f'mssql+pyodbc:///?odbc_connect={CONNECTION_STRING}'
    SQLALCHEMY_TRACK_MODIFICATIONS = False