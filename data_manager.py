from psycopg2 import sql
from psycopg2.extras import RealDictCursor
import connection


@connection.connection_handler
def add_new_user(cursor, email, password):
    query_string = """
    INSERT INTO user_and_password 
    (user_name, password)
    VALUES (%s, %s)   
    """
    cursor.execute(query_string, (email, password, ))


@connection.connection_handler
def retrieve_password_if_email_exists(cursor, email):
    query_string = """
    SELECT password FROM user_and_password 
    WHERE user_name = %s
    """
    cursor.execute(query_string, (email, ))
    return cursor.fetchall()


@connection.connection_handler
def check_if_email_already_exists(cursor, email):
    query_string = """
    SELECT id FROM user_and_password 
    WHERE user_name = %s
    """
    cursor.execute(query_string, (email, ))
    return cursor.fetchall()