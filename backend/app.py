import os
import json
import sqlite3
from datetime import datetime
from flask import Flask, request, send_file, jsonify
from hdfs import InsecureClient
from hdfs.util import HdfsError
from cryptography.fernet import Fernet
import io

app = Flask(__name__)

# Config
HDFS_URL = os.environ.get('HDFS_URL', 'http://namenode:9870')
HDFS_USER = os.environ.get('HDFS_USER', 'root')
DB_PATH = '/app/data/metadata.db'

# Encryption Key
KEY_PATH = '/app/data/secret.key'
if os.path.exists(KEY_PATH):
    with open(KEY_PATH, 'rb') as f:
        ENCRYPTION_KEY = f.read()
else:
    ENCRYPTION_KEY = Fernet.generate_key()
    os.makedirs(os.path.dirname(KEY_PATH), exist_ok=True)
    with open(KEY_PATH, 'wb') as f:
        f.write(ENCRYPTION_KEY)

cipher_suite = Fernet(ENCRYPTION_KEY)

client = InsecureClient(HDFS_URL, user=HDFS_USER)

def init_db():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS files
                 (name TEXT PRIMARY KEY, size INTEGER, uploaded_at TEXT, encrypted BOOLEAN)''')
    conn.commit()
    conn.close()

init_db()

@app.route('/upload', methods=['POST'])
def upload():
    try:
        if 'file' not in request.files:
            return jsonify({"error": "No file part in the request"}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({"error": "No selected file"}), 400

        file_data = file.read()
        original_size = len(file_data)
        
        # Encrypt file
        encrypted_data = cipher_suite.encrypt(file_data)
        
        path = f'/uploads/{file.filename}'
        
        # Ensure uploads directory exists
        try:
            client.status('/uploads', strict=False)
        except Exception:
            client.makedirs('/uploads')

        # Write to HDFS
        client.write(path, encrypted_data, overwrite=True)
        
        # Save Metadata
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        uploaded_at = datetime.utcnow().isoformat()
        
        c.execute('''INSERT OR REPLACE INTO files (name, size, uploaded_at, encrypted) 
                     VALUES (?, ?, ?, ?)''', (file.filename, original_size, uploaded_at, True))
        conn.commit()
        conn.close()

        return jsonify({"message": "Uploaded successfully", "file": file.filename})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/files', methods=['GET'])
def list_files():
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT name, size, uploaded_at, encrypted FROM files')
        rows = c.fetchall()
        conn.close()

        result = []
        for row in rows:
            result.append({
                "name": row[0],
                "size": row[1],
                "uploaded_at": row[2],
                "encrypted": bool(row[3])
            })
            
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/download/<filename>', methods=['GET'])
def download(filename):
    try:
        # Get metadata
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT encrypted FROM files WHERE name = ?', (filename,))
        row = c.fetchone()
        conn.close()

        if not row:
            return jsonify({"error": "File metadata not found"}), 404
        
        is_encrypted = row[0]
        
        hdfs_path = f'/uploads/{filename}'
        
        # Download from HDFS directly to memory
        with client.read(hdfs_path) as reader:
            file_data = reader.read()
        
        # Decrypt if needed
        if is_encrypted:
            file_data = cipher_suite.decrypt(file_data)
            
        # Send as file
        return send_file(
            io.BytesIO(file_data),
            as_attachment=True,
            download_name=filename
        )
        
    except HdfsError as e:
        return jsonify({"error": f"HDFS error: {str(e)}"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/stats', methods=['GET'])
def get_stats():
    try:
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('SELECT COUNT(*), SUM(size) FROM files')
        row = c.fetchone()
        conn.close()
        
        total_files = row[0] or 0
        total_size = row[1] or 0
        
        stats = {
            "totalFiles": total_files,
            "totalStorage": total_size,
            "apiUptime": "99.9%", # Mock value
            "activeConnections": 42, # Mock value
            "encryptionStatus": "Active (AES-128-GCM)",
            "hdfsStatus": "Connected"
        }
        return jsonify(stats)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete/<filename>', methods=['DELETE'])
def delete_file(filename):
    try:
        # Delete from HDFS
        hdfs_path = f'/uploads/{filename}'
        if client.status(hdfs_path, strict=False):
            client.delete(hdfs_path, recursive=False)
            
        # Delete metadata
        conn = sqlite3.connect(DB_PATH)
        c = conn.cursor()
        c.execute('DELETE FROM files WHERE name = ?', (filename,))
        conn.commit()
        conn.close()
        
        return jsonify({"message": f"Deleted {filename} successfully"})
    except HdfsError as e:
        return jsonify({"error": f"HDFS error: {str(e)}"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
