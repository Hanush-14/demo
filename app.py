from flask import Flask
app=Flask(__name__)
@app.route('/')
def Home():
	return "Hello this is flask Application")
if(__name__ =='__main__'):
	app.run('host=0.0.0.0',5000)
