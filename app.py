from flask import *
from flask import jsonify
import os
import time

app=Flask(__name__,template_folder='templates')
UPLOAD_FOLDER = r"https://github.com/tuanTaAnh/annotation-audio/blob/master/data/test/"
JSON_FOLDER = r"static/json/test"
path = 'https://github.com/tuanTaAnh/annotation-audio/blob/master/data/test/test_1620124434.mp3'
# path = '/Users/taanhtuan/Desktop/annotator/data/test/test_1620121009.mp3'


@app.route('/')
def upload():
    return render_template("index.html")


@app.route('/annotator', methods=['POST'])
def success():
    if request.method == 'POST':
        f = request.files['file']
        print("f: ", f)
        file_extension = f.filename.split(".")[-1]
        time_file = int(time.time())
        filename = 'test_{}.{}'.format(time_file, file_extension)
        annotation_file = 'test_{}.json'.format(time_file)
        print("file name: ", filename)
        savepath = os.path.join(UPLOAD_FOLDER, filename)
        annotationpath = os.path.join(JSON_FOLDER, annotation_file)
        f.save(savepath)
        emptydata = []
        with open(annotationpath, "w") as write_file:
            json.dump(emptydata, write_file)

        return render_template("annotator.html", path=path)



@app.route("/examplemethod", methods=['POST', 'GET'])
def example_method():
    global data
    if request.method == 'POST':
        print("POST REQ:", request)
        data = request.json
        with open('static/json/annotations.json', 'w') as outfile:
            json.dump(data, outfile)
        print("data", data)

    return jsonify(data)


if __name__ == '__main__':
    app.run(debug=True)