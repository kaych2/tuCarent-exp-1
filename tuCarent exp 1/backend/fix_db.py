import sqlite3
conn = sqlite3.connect('tucarent.db')
c = conn.cursor()
c.execute("UPDATE vehicles SET type='Electric' WHERE make='Tesla'")
van = ('Toyota', 'Hiace', 2021, 'Vans/MPVs', 'White', 80.0, 120000, 'available', 0, 0, 4.3, '/images/toyotahiace.jpg')
c.execute('INSERT INTO vehicles (make, model, year, type, color, daily_rate, mileage, availability, accidents, service_records, rating, img) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', van)
conn.commit()
print('Done')
