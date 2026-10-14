from flask import Flask, render_template

app = Flask(__name__)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/feminino")
def feminino():
    return render_template("feminino.html")


@app.route("/masculino")
def masculino():
    return render_template("masculino.html")


@app.route("/cadastro")
def cadastro():
    return render_template("cadastro.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
