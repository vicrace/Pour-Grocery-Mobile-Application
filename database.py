import sqlite3
db = sqlite3.connect('grocerydb.sqlite')

db.execute('DROP TABLE IF EXISTS grocery')
db.execute('DROP TABLE IF EXISTS category')
db.execute('DROP TABLE IF EXISTS user')

db.execute('''CREATE TABLE grocery(
    id integer PRIMARY KEY,
    name text NOT NULL,
    category text NOT NULL,
    price REAL NOT NULL,
    description text NOT NULL
)''')

db.execute('''CREATE TABLE category(
    id integer PRIMARY KEY,
    name text NOT NULL
)''')

db.execute('''CREATE TABLE user(
    id integer PRIMARY KEY,
    username text NOT NULL,
    email text UNIQUE,
    password text NOT NULL,
    address text
)''')

cursor = db.cursor()

cursor.execute('''
    INSERT INTO grocery(name,category,price,description)
    VALUES('Lushious Sweet Basil','Fresh Product',4.95,'Fresh Herbs')
''')

cursor.execute('''
    INSERT INTO grocery(name,category,price,description)
    VALUES('Nestlé Low Fat UHT Milk','Dairy & Eggs',6.50,'Low Fat U.H.T Recombined Milk')
''')

cursor.execute('''
    INSERT INTO grocery(name,category,price,description)
    VALUES('Quakers Oatmeal','Dry & Canned Foods',15.85,'Cinnamon Baked Into Every Tasty Bite Of Heart Healthy Whole Grain Goodness.')
''')

cursor.execute('''
    INSERT INTO grocery(name,category,price,description)
    VALUES('Chicken Fillet','Meat & Seafood',6.80,'Chicken Fillet With An Estimated Weight Of 400g')
''')

cursor.execute('''
    INSERT INTO grocery(name,category,price,description)
    VALUES('Rexona Advanced Whitening','Personal Care & Health',17.40,'Saviour On Sunny Days')
''')

cursor.execute('''
    INSERT INTO grocery(name,category,price,description)
    VALUES('Jinro Strawberry Alcohol','Alcohol',17.90,'Product Of Korea, Alcohol 13% By Volume')
''')

cursor.execute('''
    INSERT INTO category(name)
    VALUES('Fresh Product')
''')

cursor.execute('''
    INSERT INTO category(name)
    VALUES('Dairy & Eggs')
''')

cursor.execute('''
    INSERT INTO category(name)
    VALUES('Dry & Canned Foods')
''')

cursor.execute('''
    INSERT INTO category(name)
    VALUES('Meat & Seafood')
''')

cursor.execute('''
    INSERT INTO category(name)
    VALUES('Personal Care & Health')
''')

cursor.execute('''
    INSERT INTO category(name)
    VALUES('Alcohol')
''')

cursor.execute('''
    INSERT INTO user(username,email,password,address)
    VALUES('amelia','amelia@gmail.com','amelia1234','Jalan 1 Lorong 9 Taman Berjaya Malaysia')
''')

cursor.execute('''
    INSERT INTO user(username,email,password,address)
    VALUES('robert','robert@gmail.com','robert1234','Jalan 2 Lorong 10 Taman Kerjaya Malaysia')
''')

cursor.execute('''
    INSERT INTO user(username,email,password,address)
    VALUES('admin','admin@gmail.com','admin1234',null)
''')

db.commit()
db.close()
