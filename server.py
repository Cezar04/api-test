from flask import Flask, request, render_template, session, redirect, flash
import data_manager
import password_manager

app = Flask(__name__)

app.secret_key = "test"


@app.route('/')
def index():
    username = None
    if 'username' in session:
        username = session['username']

    return render_template("index.html", username=username)


@app.route("/register", methods=["GET", "POST"])
def register():

    username = None
    if 'username' in session:
        username = session['username']

    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        repeat_password = request.form.get('repeat-password')
        if not data_manager.check_if_email_already_exists(email):
            if password == repeat_password:
                hashed_password = password_manager.hash_password(password)
                data_manager.add_new_user(email, hashed_password)
                return redirect("/login")
            else:
                flash("Password does not match!")
        else:
            flash("Email already exists, please choose another one!")

    return render_template("register.html", username=username)


@app.route('/login', methods=["GET", "POST"])
def login():

    if request.method == "POST":
        email = request.form.get("email")
        password = request.form.get("password")
        hashed_password = data_manager.retrieve_password_if_email_exists(email)
        print(hashed_password)
        if hashed_password:
            if password_manager.verify_password(password, hashed_password[0]['password']):
                session['username'] = email
                return redirect("/")
            else:
                flash("Invalid user or password")
                return redirect("/login")
        else:
            flash("Invalid user or password")
            return redirect("/login")

    return render_template("login.html")


@app.route("/logout")
def logout():
    session.pop('username', None)
    return redirect('/')


if __name__ == "__main__":
    app.run(debug=True)
