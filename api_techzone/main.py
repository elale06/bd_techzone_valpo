import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
# Habilitar CORS es vital para que tu React (puerto 3000 o 5173) pueda pedir datos sin ser bloqueado
CORS(app) 

# ============================================================
# CONEXIÓN A LA BASE DE DATOS (Mapeo a TechZone Valpo)
# ============================================================
try:
    # Si tienes un archivo .env con MONGO_URI, lo usará. Si no, usa el localhost por defecto.
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
    cliente = MongoClient(MONGO_URI)
    cliente.admin.command("ping")
    
    # Base de datos del proyecto
    db = cliente["techzone_valpo"]
    
    # Colecciones (Adaptado a tu caso de estudio)
    col_clientes = db["clientes"]
    col_productos = db["productos"]
    col_pedidos = db["pedidos"]
    print("Conexión exitosa a MongoDB")
except Exception as e:
    print(f"No se pudo conectar a MongoDB: {e}")
    exit(1)

# ============================================================
# RUTAS PARA PRODUCTOS (Equivalente a Docentes en el apunte)
# ============================================================
@app.route('/api/productos', methods=['GET'])
def get_productos():
    productos = []
    for p in col_productos.find():
        p['_id'] = str(p['_id']) # Convertir ObjectId a string para que JSON lo entienda
        productos.append(p)
    return jsonify(productos), 200

@app.route('/api/productos', methods=['POST'])
def crear_producto():
    data = request.json
    nuevo_producto = {
        "nombre": data.get("nombre"),
        "precio": data.get("precio"),
        "stock": data.get("stock")
    }
    resultado = col_productos.insert_one(nuevo_producto)
    return jsonify({"mensaje": "Producto creado", "id": str(resultado.inserted_id)}), 201

# ============================================================
# RUTAS PARA CLIENTES (Equivalente a Alumnos en el apunte)
# ============================================================
@app.route('/api/clientes', methods=['GET'])
def get_clientes():
    clientes = []
    for c in col_clientes.find():
        c['_id'] = str(c['_id'])
        clientes.append(c)
    return jsonify(clientes), 200

@app.route('/api/clientes', methods=['POST'])
def crear_cliente():
    data = request.json
    nuevo_cliente = {
        "rut": data.get("rut"),
        "nombre": data.get("nombre"),
        "correo": data.get("correo")
    }
    resultado = col_clientes.insert_one(nuevo_cliente)
    return jsonify({"mensaje": "Cliente creado", "id": str(resultado.inserted_id)}), 201

# ============================================================
# RUTAS PARA PEDIDOS (Equivalente a Asignaturas - Muestra Relaciones)
# ============================================================
@app.route('/api/pedidos', methods=['GET'])
def get_pedidos():
    # Aquí hacemos un $lookup para emular el .populate() de Mongoose que pide el profesor
    pipeline = [
        {
            "$lookup": {
                "from": "clientes",
                "localField": "cliente_id",
                "foreignField": "_id",
                "as": "cliente_info"
            }
        },
        {
            "$lookup": {
                "from": "productos",
                "localField": "producto_id",
                "foreignField": "_id",
                "as": "producto_info"
            }
        }
    ]
    
    pedidos = []
    for pedido in col_pedidos.aggregate(pipeline):
        pedido['_id'] = str(pedido['_id'])
        pedido['cliente_id'] = str(pedido['cliente_id'])
        pedido['producto_id'] = str(pedido['producto_id'])
        # Formatear la información anidada
        if pedido['cliente_info']:
            pedido['cliente_info'][0]['_id'] = str(pedido['cliente_info'][0]['_id'])
        if pedido['producto_info']:
            pedido['producto_info'][0]['_id'] = str(pedido['producto_info'][0]['_id'])
            
        pedidos.append(pedido)
        
    return jsonify(pedidos), 200

@app.route('/api/pedidos', methods=['POST'])
def crear_pedido():
    data = request.json
    nuevo_pedido = {
        # Guardamos las relaciones usando ObjectId
        "cliente_id": ObjectId(data.get("cliente_id")),
        "producto_id": ObjectId(data.get("producto_id")),
        "cantidad": data.get("cantidad"),
        "total": data.get("total")
    }
    resultado = col_pedidos.insert_one(nuevo_pedido)
    return jsonify({"mensaje": "Pedido registrado", "id": str(resultado.inserted_id)}), 201

# ============================================================
# INICIO DEL SERVIDOR
# ============================================================
if __name__ == '__main__':
    # Se ejecuta en el puerto 5000 por defecto
    app.run(debug=True, port=5000)