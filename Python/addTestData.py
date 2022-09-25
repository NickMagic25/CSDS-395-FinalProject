import datetime

import mysql.connector
import random
import time


# connects to the AWS mysql server


def connect():
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
        return db.cursor()
    except Exception as e:
        print(e)
        print("Incorrect username or password")
        connect()


# helper function to determine movement type of random move


def make_movement_type():
    num = random.randrange(0, 3)
    if num == 0:
        return 'push'
    elif num == 1:
        return 'pull'
    else:
        return 'legs'


# adds move data to the database
# cursor: from connection to database
# stop: desired number of objects to create
# return: array with all the move names


def add_move_data(cursor, stop):
    move_arr = []
    for x in range(0, stop):
        name = "Move" + str(x)
        try:
            cursor.execute("INSERT INTO move (name, description, movement_type, muscle_group, equipment_needed) "
                           "VALUES (%s, %s, %s, %s, %s)" % (name, "do something", make_movement_type(), "NULL", "NULL"))
            print('ADDED NEW MOVE ' + name)
        except Exception as e:
            print(e)
        # if an error occurs, the move is already in the databse
        move_arr.append(name)
    return move_arr


# adds user data to the database
# cursor: from connection to database
# stop: desired number of users to create
# return: array with all the usernames


def add_user_data(cursor, stop):
    user_arr = []
    now = datetime.datetime(2022, 9, 25)
    for x in range(0, stop):
        username = "user" + str(x)
        try:
            cursor.execute("INSERT INTO user (user_name, first_name, last_name, mobile_number, email, hashed_password, "
                           "creation_date, last_online, intro, bench, deadlift, squat, weight, show_stats, show,weight,"
                           "private_account) VALUES (%s, %s, %s, %s, %s, %s, '%s', '%s', %s, %s, %s, %s, %s, %s, %s, "
                           "%s)" % (username, 'first', 'last', str(x), str(x) + '@gmail.com', 'secure password', now,
                                    now, 'NULL', 'NULL', 'NULL', 'NULL', 'NULL', 'FALSE', 'FALSE', 'FALSE'))
            print('ADDED NEW USER ' + username)
        except Exception as e:
            print(e)
        # if an error occurs, the username already exists
        user_arr.append(username)
    return user_arr


# adds workouts intot the database
# cur


def add_workout_data(cursor, user_arr, stop):
    workout_arr = []
    for x in range(0, stop):
        workout_id = str(x)
        try:
            cursor.execute("INSERT INTO workout (workout_id, name, creator_user_name, description) VALUES "
                           "(%s, %s, %s, %s)" % (workout_id, "workout "+ str(x),
                                                 user_arr[random.randrange(0, len(user_arr))], 'lift'))
            print('ADDED NEW WORKOUT. ID: ' + workout_id)
        except Exception as e:
            print(e)
        # if an error occurs, the ID exists in the database
        workout_arr.append(workout_id)
    return workout_arr


def add_workout_meta(cursor, workout_arr, stop):
    return


def add_program_data(cursor, user_arr, stop):
    return


def add_program_meta(cursor, program_arr, stop):
    return


def add_move_meta(cursor, move_arr, stop):
    return


def add_set_data(cursor, move_arr, workout_arr, stop):
    return


def add_completed_move_data(cursor, move_arr, user_arr, stop):
    return


def add_program_contains_data(cursor, program_arr, workout_arr):
    return


def add_completing_program_arr(cursor, program_arr, workout_arr):
    return


def add_user_post_data(cursor, user_arr, stop):
    return


def add_post_meta(cursor, post_arr, stop):
    return


def add_post_comments(cursor, post_arr, user_arr, stop):
    return


def add_post_likes(cursor, post_arr, user_arr, stop):
    return


def add_comment_likes(cursor, comment_arr, user_arr, stop):
    return


def add_user_follows(cursor, user_arr, stop):
    return


def add_message_groups(cursor, user_arr, stop):
    return


def add_messages(cursor, user_arr, message_group_arr, stop):
    return


def add_message_group_members(cursor, user, arr, message_group_arr, stop):
    return


def define(cursor, item):
    cursor.execute("DESCRIBE %s" % (str(item)))
    for x in cursor:
        print(x)


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
        cursor = db.cursor()
        define(cursor, "workout")
        # move_arr = add_move_data(cursor, 200)
        # user_arr=add_user_data(cursor, 200)
        print('connection terminated')
    except Exception as e:
        print(e)
        main()


main()
