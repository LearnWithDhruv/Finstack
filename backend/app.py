from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from datetime import datetime
from sqlalchemy import asc, desc
import logging

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///tasks.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
CORS(app)  # Enable CORS for all routes

# Set up logging
logging.basicConfig(level=logging.DEBUG)

# Import the Task model from models.py
from models import db, Task

db.init_app(app)

@app.route('/api/tasks', methods=['POST'])
def create_task():
    try:
        data = request.get_json()
        app.logger.debug(f"Received data: {data}")

        # Map fields, checking both camelCase and snake_case
        mapped_data = {
            'date': data.get('date'),
            'entity_name': data.get('entityName') or data.get('entity_name'),
            'task_type': data.get('taskType') or data.get('task_type'),
            'time': data.get('time'),
            'contact_person': data.get('contactPerson') or data.get('contact_person'),
            'phone_number': data.get('phoneNumber') or data.get('phone_number', ''),
            'note': data.get('note', ''),
            'status': data.get('status', 'Open')
        }

        # Validate required fields
        required_fields = ['entity_name', 'task_type', 'contact_person', 'date', 'time']
        missing_fields = [field for field in required_fields if not mapped_data.get(field)]
        if missing_fields:
            app.logger.error(f"Missing required fields: {missing_fields}")
            return jsonify({'error': f"Missing required fields: {', '.join(missing_fields)}"}), 400

        # Convert date from YYYY-MM-DD to DD/MM/YYYY
        try:
            date_obj = datetime.strptime(mapped_data['date'], '%Y-%m-%d')
            mapped_data['date'] = date_obj.strftime('%d/%m/%Y')
        except ValueError:
            app.logger.error(f"Invalid date format: {mapped_data['date']}")
            return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        # Convert time from HH:MM to HH:MM AM/PM
        try:
            time_obj = datetime.strptime(mapped_data['time'], '%H:%M')
            mapped_data['time'] = time_obj.strftime('%I:%M %p')
        except ValueError:
            app.logger.error(f"Invalid time format: {mapped_data['time']}")
            return jsonify({'error': 'Invalid time format. Use HH:MM (24-hour)'}), 400

        new_task = Task(
            date=mapped_data['date'],
            entity_name=mapped_data['entity_name'],
            task_type=mapped_data['task_type'],
            time=mapped_data['time'],
            contact_person=mapped_data['contact_person'],
            phone_number=mapped_data['phone_number'],
            note=mapped_data['note'],
            status=mapped_data['status']
        )
        
        db.session.add(new_task)
        db.session.commit()
        app.logger.info(f"Task created with ID: {new_task.id}")
        return jsonify({'message': 'Task created successfully', 'id': new_task.id}), 201
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error creating task: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    try:
        query = Task.query

        # Filtering
        if 'task_type' in request.args:
            query = query.filter_by(task_type=request.args['task_type'])
        if 'status' in request.args:
            query = query.filter_by(status=request.args['status'])
        if 'contact_person' in request.args:
            query = query.filter_by(contact_person=request.args['contact_person'])
        if 'entity_name' in request.args:
            query = query.filter_by(entity_name=request.args['entity_name'])
        if 'date' in request.args:
            query = query.filter_by(date=request.args['date'])

        # Sorting
        sort_by = request.args.get('sort_by', 'date')
        sort_order = request.args.get('sort_order', 'asc')
        order_func = asc if sort_order == 'asc' else desc

        if sort_by == 'date':
            query = query.order_by(order_func(Task.date))
        elif sort_by == 'entity_name':
            query = query.order_by(order_func(Task.entity_name))
        elif sort_by == 'task_type':
            query = query.order_by(order_func(Task.task_type))
        elif sort_by == 'time':
            query = query.order_by(order_func(Task.time))
        elif sort_by == 'contact_person':
            query = query.order_by(order_func(Task.contact_person))
        elif sort_by == 'status':
            query = query.order_by(order_func(Task.status))

        tasks = query.all()
        # Map snake_case to camelCase for frontend
        return jsonify([{
            'id': task.id,
            'date': task.date,
            'entityName': task.entity_name,
            'taskType': task.task_type,
            'time': task.time,
            'contactPerson': task.contact_person,
            'phoneNumber': task.phone_number if hasattr(task, 'phone_number') else '',
            'note': task.note if task.note is not None else '',
            'status': task.status
        } for task in tasks])
    except Exception as e:
        app.logger.error(f"Error fetching tasks: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:id>', methods=['PUT'])
def update_task(id):
    try:
        task = Task.query.get_or_404(id)
        data = request.get_json()
        app.logger.debug(f"Received update data for task {id}: {data}")

        # Map fields, checking both camelCase and snake_case
        mapped_data = {
            'date': data.get('date', task.date),
            'entity_name': data.get('entityName', task.entity_name) or data.get('entity_name', task.entity_name),
            'task_type': data.get('taskType', task.task_type) or data.get('task_type', task.task_type),
            'time': data.get('time', task.time),
            'contact_person': data.get('contactPerson', task.contact_person) or data.get('contact_person', task.contact_person),
            'phone_number': data.get('phoneNumber', task.phone_number) or data.get('phone_number', task.phone_number),
            'note': data.get('note', task.note),
            'status': data.get('status', task.status)
        }

        # Validate date format if provided
        if mapped_data['date'] != task.date:
            try:
                date_obj = datetime.strptime(mapped_data['date'], '%Y-%m-%d')
                mapped_data['date'] = date_obj.strftime('%d/%m/%Y')
            except ValueError:
                app.logger.error(f"Invalid date format: {mapped_data['date']}")
                return jsonify({'error': 'Invalid date format. Use YYYY-MM-DD'}), 400

        # Validate time format if provided
        if mapped_data['time'] != task.time:
            try:
                time_obj = datetime.strptime(mapped_data['time'], '%H:%M')
                mapped_data['time'] = time_obj.strftime('%I:%M %p')
            except ValueError:
                app.logger.error(f"Invalid time format: {mapped_data['time']}")
                return jsonify({'error': 'Invalid time format. Use HH:MM (24-hour)'}), 400

        # Update task fields
        task.date = mapped_data['date']
        task.entity_name = mapped_data['entity_name']
        task.task_type = mapped_data['task_type']
        task.time = mapped_data['time']
        task.contact_person = mapped_data['contact_person']
        task.phone_number = mapped_data['phone_number']
        task.note = mapped_data['note']
        task.status = mapped_data['status']

        db.session.commit()
        app.logger.info(f"Task {id} updated successfully")
        return jsonify({'message': 'Task updated successfully'})
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error updating task {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/tasks/<int:id>', methods=['DELETE'])
def delete_task(id):
    try:
        task = Task.query.get_or_404(id)
        db.session.delete(task)
        db.session.commit()
        app.logger.info(f"Task {id} deleted successfully")
        return jsonify({'message': 'Task deleted successfully'})
    except Exception as e:
        db.session.rollback()
        app.logger.error(f"Error deleting task {id}: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/')
def home():
    return jsonify({'message': 'Welcome to the Task API. Use /api/tasks to interact with tasks.'}), 200

if __name__ == '__main__':
    with app.app_context():
        db.create_all()  # Create tables if they don't exist
    app.run(debug=True)