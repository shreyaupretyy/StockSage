import pymysql

try:
    # Establishing connection to the database
    connection = pymysql.connect(
        host='localhost',
        user='root',
        password='root',
        database='stocksage_db'
    )
    print("Connection successful!")

    # Creating a cursor object to execute queries
    cursor = connection.cursor()

    # Example: Fetching all rows from a table (replace 'your_table_name' with the actual table name)
    query = "SELECT * FROM user;"  # Replace with your table name
    cursor.execute(query)

    # Fetching all rows from the result
    rows = cursor.fetchall()

    # Printing the data
    for row in rows:
        print(row)

except pymysql.MySQLError as e:
    print("Error:", e)

finally:
    # Closing the connection
    if connection:
        connection.close()
        print("Connection closed.")