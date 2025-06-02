from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Task(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    date = db.Column(db.String(10), nullable=False)
    entity_name = db.Column(db.String(100), nullable=False)
    task_type = db.Column(db.String(50), nullable=False)
    time = db.Column(db.String(8), nullable=False)
    contact_person = db.Column(db.String(100), nullable=False)
    phone_number = db.Column(db.String(20), nullable=True)
    note = db.Column(db.Text, nullable=True)
    status = db.Column(db.String(10), nullable=False, default="Open")