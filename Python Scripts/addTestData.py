import mysql.connector
import random
import datetime


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
    num = random.randint(0, 2)
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
    print("Adding move data....")
    move_arr = []
    for x in range(0, stop):
        name = "Move" + str(x)
        try:
            cursor.execute("INSERT INTO move (name, description, movement_type, muscle_group, equipment_needed) VALUES "
                           "('%s', '%s', '%s', NULL, NULL)" % (name, "do something", make_movement_type()))
            move_arr.append(name)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("Move data added!\n")
    return move_arr


# adds user data to the database
# cursor: from connection to database
# stop: desired number of users to create
# return: array with all the usernames
def add_user_data(cursor, stop):
    print("Adding user data...")
    user_arr = []
    now = datetime.datetime.now()
    for x in range(0, stop):
        username = "user" + str(x)
        try:
            cursor.execute("INSERT INTO user (user_name, first_name, last_name, mobile_number, email, hashed_password, "
                           "creation_date, last_online, intro, bench, deadlift, squat, weight, show_stats, show_weight,"
                           " private_account) VALUES ('%s', '%s', '%s', '%s', '%s', '%s', '%s', '%s', NULL, NULL, NULL,"
                           " NULL, NULL, 0, 0, 0)" % (username, 'first', 'last', str(x), str(x) + '@gmail.com',
                                                      'secure password', now, now))
            user_arr.append(username)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("User data added!\n")
    return user_arr


# adds workouts into the database
# cursor: from connection to the database
# user_arr: array of all usernames added to the database
# stop: number of workouts to add
# return: array with all the workout IDs
def add_workout_data(cursor, user_arr, stop):
    print("Adding workout data...")
    workout_arr = []
    for x in range(0, stop):
        workout_id = str(x)
        try:
            cursor.execute("INSERT INTO workout (workout_id, name, creator_user_name, description) VALUES "
                           "('%s', '%s', '%s', '%s')" % (workout_id, "workout " + str(x),
                                                         user_arr[random.randint(0, len(user_arr) - 1)], 'lift'))
            workout_arr.append(workout_id)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("Workout data added!\n")
    return workout_arr


# adds workout metadata
# cursor: from database connection
# workout_arr: array of all workout IDs added
# stop: number of workouts to add metadata to
# return: array of all workouts with metadata
def add_workout_meta(cursor, workout_arr, stop):
    print("Adding workout metadata...")
    workout_meta_arr = []
    for x in range(0, stop):
        # get a random workout ID
        workout_id = workout_arr[random.randint(0, len(workout_arr) - 1)]
        try:
            cursor.execute("INSERT INTO workout_meta (workout_id, `key`, content) VALUES ('%s', '%s', \"%s\")" %
                           (workout_id, 'some key', 'some content'))
            workout_meta_arr.append(workout_id)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("Workout metadata added!\n")
    return workout_meta_arr


# creates programs in the database
# cursor: from database connection
# user_arr: array of all usernames added to the database
# stop: number of programs to create
# return: array of program IDs
def add_program_data(cursor, user_arr, stop):
    print("Adding program data...")
    program_arr = []
    for x in range(0, stop):
        program_id = str(x)
        user_name = user_arr[random.randint(0, len(user_arr) - 1)]
        try:
            cursor.execute("INSERT INTO program (program_id, program_name, program_creator, description, length) "
                           "VALUES ('%s', '%s', '%s', '%s', '%s')" % (program_id, 'some name', user_name, 'text',
                                                                      str(random.randint(1, 100))))
            program_arr.append(program_id)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("Program data added!\n")
    return program_arr


# adds program metadata to the database
# cursor: from database connection
# program_arr: array of program IDs
# stop: number of programs with metadata added
# return: array of program ID's with metadata
def add_program_meta(cursor, program_arr, stop):
    print("Adding program metadata...")
    program_meta_arr = []
    for x in range(0, stop):
        program_id = program_arr[random.randint(0, len(program_arr) - 1)]
        try:
            cursor.execute("INSERT INTO program_meta (program_id, `key`, content) VALUES ('%s', '%s', \"%s\")"
                           % (program_id, 'some key', 'some content'))
            program_meta_arr.append(program_id)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("Program metadata added!\n")
    return program_meta_arr


# adds metadata for moves
# cursor: from database connection
# move_arr: array of move names
# stop: amount of metadata generated
# return: array of move names with metadata
def add_move_meta(cursor, move_arr, stop):
    print("Adding move metadata...")
    move_meta_arr = []
    for x in range(0, stop):
        move_name = move_arr[random.randint(0, len(move_arr) - 1)]
        try:
            cursor.execute("INSERT INTO move_meta (name, `key`, content) VALUES ('%s', '%s', \"%s\")" %
                           (move_name, 'some key', 'some content'))
            move_meta_arr.append(move_name)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("Move metadata added!\n")
    return move_meta_arr


# adds sets to workouts
# cursor: from connection to database
# move_arr: name of moves that can be added to a set
# workout_arr: workout IDs to add sets to
# stop: number of sets that will be created
# return: array of all workout IDs with sets
def add_set_data(cursor, move_arr, workout_arr, stop):
    print("Adding set data...")
    set_arr = []
    for x in range(0, stop):
        workout_id = workout_arr[random.randint(0, len(workout_arr) - 1)]
        move_name = move_arr[random.randint(0, len(move_arr) - 1)]
        try:
            cursor.execute("INSERT INTO `set` (workout_id, move_name, rep_count, repetition, set_num) VALUES "
                           "('%s', '%s', %s, %s, %s)" % (workout_id, move_name, -1, -1, -1))
            set_arr.append(workout_id)
        except Exception as e:
            print(e)
            print("Something went wrong")
            return
    print("Set data added!\n")
    return set_arr


# adds completed move data to the database
# cursor: from connection to database
# move_arr: lists of moves added to the database
# user_arr: lists of users added to the database
# stop: number of completed moves that will be added to the database
# return: array of usernames that have completed at least one move
def add_completed_move_data(cursor, move_arr, user_arr, stop):
    print("Adding completed move data...")
    completed_move_arr = []
    now = datetime.datetime.now()
    for x in range(0, stop):
        move_name = move_arr[random.randint(0, len(move_arr) - 1)]
        username = user_arr[random.randint(0, len(move_arr) - 1)]
        try:
            cursor.execute("INSERT INTO completed_move (move_name, user_name, weight_in_pounds, rep_count, "
                           "last_completed) VALUES ('%s', '%s', %s, %s, '%s')" %
                           (move_name, username, '-1', '-1', now))
            completed_move_arr.append(username)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("Completed move data added!\n")
    return completed_move_arr


# adds workouts to a program
# cursor: from database connection
# program_arr: array of program  IDs that were added
# workout_arr: array of workout IDs that were added
# stop: number of relations that will be made
# return: array of program IDs that have workouts added to them
def add_program_contains_data(cursor, program_arr, workout_arr, stop):
    print("Adding program contains data...")
    program_contains_arr = []
    for x in range(0, stop):
        program_id = program_arr[random.randint(0,len(program_arr)-1)]
        workout_id = workout_arr[random.randint(0, len(workout_arr)-1)]
        try:
            cursor.execute("INSERT INTO program_contains (program_id, workout_id, day_of) VALUES ('%s', '%s', '%s')"
                           % (program_id, workout_id, '-1'))
            program_contains_arr.append(program_id)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("Program contains data added!\n")
    return program_contains_arr


# adds completing program data
# cursor: from database connection
# program_arr: array of program IDs
# user_arr: array of users to add
# stop: number of relations added to the database
# return: array of users that are completing a program
def add_completing_program(cursor, program_arr, user_arr, stop):
    print("Adding completed program data...")
    completing_program_arr = []
    now = datetime.datetime.now()
    for x in range(0 , stop):
        program_id = program_arr[random.randint(0, len(program_arr)-1)]
        username = user_arr[random.randint(0, len(user_arr)-1)]
        try:
            cursor.execute("INSERT INTO completing_program (program_id, user_name, date_started, day_of_program, "
                           "completed) VALUES ('%s', '%s', %s, %s, '%s')" % (program_id, username, '-1', '-1', now))
            completing_program_arr.append(username)
        except Exception as e:
            print(e)
            print("Something went wrong\n")
            return
    print("Completing program Data added!\n")
    return completing_program_arr


# Generates user post data
# cursor: from database connection
# user_arr: array of usernames that were added to the database
# stop: number of posts to generate
# return: array of post IDs
def add_user_post_data(cursor, user_arr, stop):
    print("Adding user post data")
    post_arr = []
    now = datetime.datetime.now()
    for x in range(0, stop):
        username = user_arr[random.randint(0, len(user_arr)-1)]
        post_id = "post" + str(x)
        try:
            cursor.execute("INSERT INTO completing_program (post_id, user_name, message, created_at) VALUES "
                           "('%s', '%s', \"%sS\", '%s')" % (post_id, username, "This is a message", now))
            post_arr.append(post_id)
        except Exception as e:
            print(e)
            print("Something went wrong \n")
            return
    print("Successfully added post data! \n")
    return post_arr


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


def add_data(cursor, stop):
    move_arr = add_move_data(cursor, stop)
    user_arr = add_user_data(cursor, stop)
    workout_arr = add_workout_data(cursor, user_arr, stop)
    workout_meta_arr = add_workout_meta(cursor, workout_arr, stop)
    program_arr = add_program_data(cursor, user_arr, stop)
    program_meta_arr = add_program_meta(cursor, program_arr, stop)
    move_meta_arr = add_move_meta(cursor, move_arr, stop)
    set_arr = add_set_data(cursor, move_arr, workout_arr, stop)
    completed_move_arr = add_completed_move_data(cursor, move_arr, user_arr, stop)
    program_contains_arr = add_program_contains_data(cursor, program_arr, workout_arr, stop)
    completed_program_arr = add_completing_program(cursor, program_arr, user_arr, stop)
    post_arr = add_user_post_data(cursor, user_arr, stop)

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
        add_data(cursor, 2)
        # db.commit()
        print('connection terminated')
    except Exception as e:
        print(e)
        # main()


main()
