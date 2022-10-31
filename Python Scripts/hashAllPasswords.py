import mysql.connector
import bcrypt


# gets all usernames and passwords
def get_users(currsor):
    sql = "SELECT user_name, hashed_password FROM user"
    currsor.execute(sql)
    res = currsor.fetchall()
    return res


# takes in a list where the first element is the username and the second element is the unhashed password
# runs bcrypt and updates in the database.
def hash_password(cursor, user_arr):
    username = user_arr[0]
    password = user_arr[1]
    password = password.encode('utf-8')
    salt = bcrypt.gensalt(10)
    hashedpw = bcrypt.hashpw(password, salt)
    hashedpw=hashedpw.decode()
    print(str(hashedpw) + "\n")
    sql = "UPDATE user SET hashed_password ='%s' WHERE user_name='%s'" % (str(hashedpw), username)
    cursor.execute(sql)


# hashes all passwords
def hash_all(cursor):
    users = get_users(cursor)
    print(users)
    for user in users:
        print(user[0])
        hash_password(cursor,user)


def main():
    uname = input('username: ')
    pwd = input('password: ')
    try:
        db = mysql.connector.connect(
            host='csds-395-group4.co1rrt8vxy1n.us-east-1.rds.amazonaws.com',
            user=uname,
            passwd=pwd,
            database='insta-jacked'
        )
        print('successfully connected to insta-jacked \n')
        cursor = db.cursor(buffered=True)
        hash_all(cursor)
        db.commit()
    except Exception as e:
        print(e)


main()
