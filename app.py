import sqlite3
from flask import Flask, jsonify, request, abort
from argparse import ArgumentParser

app = Flask(__name__)

#create dictionary for both grocery and category (easy retrieval)
def get_grocery_row(row):
    row_dict = {
        'id': row[0],
        'name': row[1],
        'category': row[2],
        'price':row[3],
        'description': row[4],
    }
    return row_dict

def get_category_row(row):
    row_dict= {
        'id': row[0],
        'name':row[1],
    }
    return row_dict

def get_user_row(row):
    row_dict= {
        'id': row[0],
        'username':row[1],
        'email':row[2],
        'password':row[3],
        'address':row[4],
    }
    return row_dict

#for database connection
def db_con():
    conn = None
    try:
        conn = sqlite3.connect('grocerydb.sqlite')
    except sqlite3.error as e:
        print(e)
    return conn

#manipulate GROCERY

#for get all & insert method
@app.route('/api/grocery',methods = ['GET','POST'])
def all_grocery():
    conn = db_con()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute("SELECT * from grocery")
        
        rows = cursor.fetchall()
        conn.close()
        
        rows_as_dict = []
        for row in rows:
            row_as_dict = get_grocery_row(row)
            rows_as_dict.append(row_as_dict)

        return jsonify(rows_as_dict), 200
    
    if request.method == 'POST':
        if not request.json:
            abort(404)

        new_grocery = (
            request.json['name'],
            request.json['category'],
            request.json['price'],
            request.json['description'],
        )

        cursor.execute('''INSERT INTO grocery(name,category,price,description) VALUES(?,?,?,?)''', new_grocery)

        grocery_id = cursor.lastrowid
        conn.commit()

        response = {
            'id': grocery_id,
            'affected': conn.total_changes,
        }
        conn.close()
        return jsonify(response), 201

#for get 1 grocery, update and delete
@app.route('/api/grocery/<int:id>',methods = ['GET', 'PUT', 'DELETE'])
def single_grocery(id):

    conn = db_con()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute('SELECT * FROM grocery WHERE id=?', (id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            row_as_dict = get_grocery_row(row)
            return jsonify(row_as_dict), 200
        else:
            return jsonify(None), 200

    if request.method == "PUT":
        if not request.json:
            abort(400)

        if 'id' not in request.json:
            abort(400)

        if int(request.json['id']) != id:
            abort(400)
        
        update_grocery = (
            request.json['name'],
            request.json['category'],
            request.json['price'],
            request.json['description'],
            str(id),
        )

        cursor.execute(''' UPDATE grocery SET name=?, category=?, price=?, description=? WHERE id=?''', update_grocery)
        conn.commit()

        response = {
        'id': id,
        'affected': conn.total_changes,
        }
        conn.close()
        return jsonify(response), 201


    if request.method == "DELETE":
        if not request.json:
            abort(400)

        if 'id' not in request.json:
            abort(400)

        if int(request.json['id']) != id:
            abort(400)

        cursor.execute('DELETE FROM grocery WHERE id=?', (str(id),))

        conn.commit()

        response = {
            'id':   id,
            'affected': conn.total_changes,
        }

        conn.close()
        return jsonify(response), 201


#manipulate CATEGORY

#for get all & insert method
@app.route('/api/cat',methods = ['GET','POST'])
def all_cat():
    conn = db_con()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute("SELECT * from category")
        
        rows = cursor.fetchall()
        conn.close()
        
        rows_as_dict = []
        for row in rows:
            row_as_dict = get_category_row(row)
            rows_as_dict.append(row_as_dict)

        return jsonify(rows_as_dict), 200
    
    if request.method == 'POST':
        if not request.json:
            abort(404)

        new_cat = (
            request.json['name'],
        )

        cursor.execute('''INSERT INTO category(name) VALUES(?)''', new_cat)

        cat_id = cursor.lastrowid
        conn.commit()

        response = {
            'id': cat_id,
            'affected': conn.total_changes,
        }
        conn.close()
        return jsonify(response), 201


#for get 1 cat, update and delete
@app.route('/api/cat/<int:id>',methods = ['GET', 'PUT', 'DELETE'])
def single_cat(id):

    conn = db_con()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute('SELECT * FROM category WHERE id=?', (id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            row_as_dict = get_category_row(row)
            return jsonify(row_as_dict), 200
        else:
            return jsonify(None), 200

    if request.method == "PUT":
        if not request.json:
            abort(400)

        if 'id' not in request.json:
            abort(400)

        if int(request.json['id']) != id:
            abort(400)

        #retrieve the old category
        old_cat = cursor.execute('SELECT name FROM category WHERE id=?', (id,))
        row = old_cat.fetchone()
        c_cat = None
        if row:
            c_cat = row[0]

        update_grocery = (
            request.json['name'],
            c_cat
        )

        update_cat = (
            request.json['name'],
            str(id),
        )

        #replace the grocery & category
        cursor.execute(''' UPDATE grocery SET category=? WHERE category=?''', update_grocery)
        cursor.execute(''' UPDATE category SET name=? WHERE id=?''', update_cat)
        conn.commit()

        response = {
        'id': id,
        'affected': conn.total_changes,
        }
        conn.close()
        return jsonify(response), 201


    if request.method == "DELETE":
        if not request.json:
            abort(400)

        if 'id' not in request.json:
            abort(400)

        if int(request.json['id']) != id:
            abort(400)

        #retrieve the old category
        old_cat = cursor.execute('SELECT name FROM category WHERE id=?', (id,))
        row = old_cat.fetchone()
        c_cat = None
        if row:
            c_cat = row[0]
        
        update_grocery = (
            str("none"),
            c_cat
        )

        cursor.execute(''' UPDATE grocery SET category=? WHERE category=?''', update_grocery)
        cursor.execute('DELETE FROM category WHERE id=?', (str(id),))

        conn.commit()

        response = {
            'id':   id,
            'affected': conn.total_changes,
        }

        conn.close()
        return jsonify(response), 201


#manipulate user

#for get all & insert method
@app.route('/api/user',methods = ['GET','POST'])
def all_user():
    conn = db_con()
    cursor = conn.cursor()

    if request.method == 'GET':
        cursor.execute("SELECT * from user")
        
        rows = cursor.fetchall()
        conn.close()
        
        rows_as_dict = []
        for row in rows:
            row_as_dict = get_user_row(row)
            rows_as_dict.append(row_as_dict)

        return jsonify(rows_as_dict), 200
    
    if request.method == 'POST':
        if not request.json:
            abort(404)

        new_user = (
            request.json['username'],
            request.json['email'],
            request.json['password'],
            request.json['address'],
        )

        cursor.execute('''INSERT INTO user(username,email,password,address) VALUES(?,?,?,?)''', new_user)
        user_id = cursor.lastrowid
        conn.commit()

        response = {
            'id': user_id,
            'affected': conn.total_changes,
        }
        conn.close()
        return jsonify(response), 201

#for get 1 user, update and delete
@app.route('/api/user/<int:id>',methods = ['GET', 'PUT', 'DELETE'])
def single_user(id):

    conn = db_con()
    cursor = conn.cursor()

    if request.method == "GET":
        cursor.execute('SELECT * FROM user WHERE id=?', (id,))
        row = cursor.fetchone()
        conn.close()

        if row:
            row_as_dict = get_user_row(row)
            return jsonify(row_as_dict), 200
        else:
            return jsonify(None), 200

    if request.method == "PUT":
        if not request.json:
            abort(400)

        if 'id' not in request.json:
            abort(400)

        if int(request.json['id']) != id:
            abort(400)

        update_user = (
            request.json['username'],
            request.json['email'],
            request.json['address'],
            request.json['password'],
            str(id),
        )
        
        cursor.execute(''' UPDATE user SET username=?, email=?, address=?, password=? WHERE id=?''', update_user)
        conn.commit()

        response = {
        'id': id,
        'affected': conn.total_changes,
        }
        conn.close()
        return jsonify(response), 201


    if request.method == "DELETE":
        if not request.json:
            abort(400)

        if 'id' not in request.json:
            abort(400)

        if int(request.json['id']) != id:
            abort(400)

        cursor.execute('DELETE FROM user WHERE id=?', (str(id),))

        conn.commit()

        response = {
            'id':   id,
            'affected': conn.total_changes,
        }

        conn.close()
        return jsonify(response), 201


if __name__ == "__main__":

    parser = ArgumentParser()
    parser.add_argument('-p', '--port', default=5000, type=int, help='port to listen on')
    args = parser.parse_args()
    port = args.port

    app.run(host='0.0.0.0', port=port, debug=True)