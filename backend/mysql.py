import pymysql.cursors
import pymysql

# Connect to the database
connection = pymysql.connect(host='localhost',
                             user='user',
                             password='password',
                             db='mydb',
                             charset='utf8mb4',
                             cursorclass=pymysql.cursors.DictCursor)


with connection.cursor() as cursor:
    insert_text = "INSERT INTO `reports` (`Practitioner`,`NIP`,`Text`,`Result`,`Date`) Values (%s,%s,%s,%s,%s)"
    cursor.execute(insert_text, (1,"test","this is the text",0.01,"2018-08-20"))

connection.commit()
