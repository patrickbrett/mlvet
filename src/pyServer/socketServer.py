from flask import Flask
from flask_socketio import SocketIO
from transcription import transcribe

app = Flask(__name__)
socketio = SocketIO(app)


@socketio.event
def connect():
    print('connect')


@socketio.on('transcribe')
def transcribeHandler(data):
    print('transcribe', data)
    filepath = "\"%s\""%data
    transcription = transcribe(filepath)
    print(transcription)
    return transcription


@socketio.event
def disconnect():
    print('disconnect')


if __name__ == '__main__':
    socketio.run(app)