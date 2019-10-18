import pymysql.cursors
import pymysql

# Connect to the database
connection = pymysql.connect(host='localhost',
                             user='user',
                             password='password',
                             db='ssdreports',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


with connection.cursor() as cursor:
    read_reports = "SELECT * FROM `reports`"
    cursor.execute(read_reports)
    print(len(cursor.fetchall()))
